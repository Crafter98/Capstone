#!/usr/bin/env python
# coding: utf-8

# In[1]:


import pandas as pd
import torch
from torch.nn import functional as F
from torch.utils.data import DataLoader, Dataset

from tqdm.notebook import tqdm
import torch.nn as nn
import torch.optim as optim
import io
from keras.models import load_model


# In[2]:


from transformers import AutoTokenizer, ElectraForSequenceClassification, AdamW


# In[3]:


cuda = torch.device('cuda')


# In[4]:


class NSMCDataset(Dataset):
  
  def __init__(self, csv_file):
    # 일부 값중에 NaN이 있음...
    self.dataset = pd.read_csv(csv_file, sep='\t')#.dropna(axis=0) 
    # 중복제거
    #self.dataset.drop_duplicates(subset=['document'], inplace=True)
    self.tokenizer = AutoTokenizer.from_pretrained("monologg/koelectra-small-v2-discriminator")

    print(self.dataset.describe())
  
  def __len__(self):
    return len(self.dataset)
  
  def __getitem__(self, idx):
    row = self.dataset.iloc[idx, 1:3].values
    text = row[0]
    y = row[1]

    inputs = self.tokenizer(
        text, 
        return_tensors='pt',
        truncation=True,
        max_length=256,
        pad_to_max_length=True,
        add_special_tokens=True
        )
    
    input_ids = inputs['input_ids'][0]
    attention_mask = inputs['attention_mask'][0]

    return input_ids, attention_mask, y


# In[8]:


train_dataset = NSMCDataset("merge_train.txt")
test_dataset = NSMCDataset("merge_test.txt")


# In[5]:


model = ElectraForSequenceClassification.from_pretrained("monologg/koelectra-small-v2-discriminator").cuda()


# In[10]:


epochs = 30
batch_size = 32


# In[7]:


optimizer = AdamW(model.parameters(), lr=1e-5)
train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
test_loader = DataLoader(test_dataset, batch_size=16, shuffle=True)


# In[10]:


model.load_state_dict(torch.load('koelectra_learn.pt'))


# In[8]:


checkpoint = torch.load('koelectra_learn.pt')
model.load_state_dict(checkpoint['model_state_dict'])
optimizer.load_state_dict(checkpoint['optimizer_state_dict'])
epoch = checkpoint['epoch']
loss = checkpoint['loss']
start_epoch = epoch + 1
print(epoch)
print(start_epoch)


# In[23]:


losses = []
accuracies = []

for i in range(start_epoch,epochs):
  print(i)
  total_loss = 0.0
  correct = 0
  total = 0
  batches = 0

  model.train()

  for input_ids_batch, attention_masks_batch, y_batch in tqdm(train_loader):
    optimizer.zero_grad()
    y_batch = y_batch.cuda()
    y_pred = model(input_ids_batch.cuda(), attention_mask=attention_masks_batch.cuda())[0]
    loss = F.cross_entropy(y_pred, y_batch)
    loss.backward()
    optimizer.step()

    total_loss += loss.item()

    _, predicted = torch.max(y_pred, 1)
    correct += (predicted == y_batch).sum()
    total += len(y_batch)

    batches += 1
    if batches % 100 == 0:
      print("Batch Loss:", total_loss, "Accuracy:", correct.float() / total)
  
  losses.append(total_loss)
  accuracies.append(correct.float() / total)
  print("Train Loss:", total_loss, "Accuracy:", correct.float() / total)
  
  torch.save(model, 'koelectra_learn.pt')

  torch.save({
      'epoch': i,
      'model_state_dict': model.state_dict(),
      'optimizer_state_dict': optimizer.state_dict(),
      'loss': loss,
  }, 'koelectra_learn.pt')
    


# In[24]:


model.eval()

test_correct = 0
test_total = 0

for input_ids_batch, attention_masks_batch, y_batch in tqdm(test_loader):
  y_batch = y_batch.cuda()
  y_pred = model(input_ids_batch.cuda(), attention_mask=attention_masks_batch.cuda())[0]
  _, predicted = torch.max(y_pred, 1)
  test_correct += (predicted == y_batch).sum()
  test_total += len(y_batch)

print("Accuracy:", test_correct.float() / test_total)


# In[9]:


import requests
import pymysql
from sqlalchemy import create_engine


# In[10]:


pymysql.install_as_MySQLdb()


# In[11]:


engine = create_engine("mysql+mysqldb://user:KAU@125.187.32.134:3306/capstone", encoding='utf-8')
conn = engine.connect()


# In[13]:


from datetime import datetime, timedelta

start = "2021-12-01"
last ="2021-12-02"

# 시작일, 종료일 datetime 으로 변환 
start_date = datetime.strptime(start, "%Y-%m-%d") 
last_date = datetime.strptime(last, "%Y-%m-%d")

while start_date <= last_date:
    dates = start_date.strftime("%Y-%m-%d")
    date = dates.replace("-",".")
    sql1 = "select * from secondary_crawling where date ="
    sql = sql1 + " " + "'" + date + "'" +";"
    #print(dates)
    print(sql)
    
    result = engine.execute(sql).fetchall()

    testdf = pd.DataFrame(result)
    testdf.columns = ['keyword', 'comments', 'date', 'section', 'idx', 'react']

    testdf_index = testdf[['comments','react']]
    testdf_index.columns = ['document', 'label']
    #print(testdf_index)
    testdf_index.to_csv('testdf_index2.txt', index = True, header = True, sep = "\t")
    
    testdf_dataset = NSMCDataset("testdf_index2.txt")
    
    emo_list = [] # 감성 값을 담을 리스트
    
    i = 0
    for r in result :
        print(i)
        if(testdf_index.loc[i, 'document'] !="") :
            text, attention_mask, y = testdf_dataset[i]
            out = model(text.unsqueeze(0).cuda(), attention_mask=attention_mask.unsqueeze(0).cuda())
            temp = out[0][0]
            if temp[0] < temp[1] :
                keyword = r['keyword']
                date = r['date']
                sec = r['section']
                idx = r['idx']
                update_sql = "UPDATE secondary_crawling SET react=1" + " WHERE keyword='" + keyword + "' AND date='" + date + "' AND section='" + sec + "' AND idx=" + str(idx)
                print(update_sql)
                engine.execute(update_sql)
        
            
        i = i+1
         
        
    start_date += timedelta(days=1)

