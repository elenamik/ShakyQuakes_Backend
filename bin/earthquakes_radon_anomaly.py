# -*- coding: utf-8 -*-
"""earthquakes_radon_anomaly.ipynb

Automatically generated by Colaboratory.

Original file is located at
    https://colab.research.google.com/drive/19WyoBVOMrvB3tvdfJkHI6lzaMFcKSpVz

Created using Watson Studio
"""

import numpy as np
import matplotlib.pyplot as plt
from pylab import savefig
from sklearn.ensemble import IsolationForest

import types
import pandas as pd
import sys


def predict_anomalies(df):
  '''finds anomalies from given data and returns anomalous entries'''
  rng = np.random.RandomState(42)

  # Isolation Forest ----
  # unsupervised learning
  clf = IsolationForest(max_samples=200, random_state=rng)
  clf.fit(df)
  
  # predictions
  anomaly_predictions = clf.predict(df)
  return anomaly_predictions

def get_anomaly_values(df,anomaly_predictions):
  '''returns values for anomalous points'''
  predictions=anomaly_predictions.tolist()
  df2=df.assign(anomaly=predictions)    

  anomaly_val=[]
  for i in range(len(df2['anomaly'])):
    if df2['anomaly'][i]==-1:
      #print(df['Radon'][i])
      anomaly_val.append(df['Radon'][i])
      return anomaly_val

def accuracy(anomaly_predictions):
  # new, 'normal' observations ----
  print("Accuracy:", list(anomaly_predictions).count(1)/anomaly_predictions.shape[0])

#earthquakes
def get_detected_earthquakes(earthquakes,anomaly_val):
  '''returns list of detected earthquake indexes'''
  detected=[]
  for i in range(len(earthquakes['radon_level'])):
    if earthquakes['radon_level'][i] in anomaly_val:
      detected.append(i)
  return detected

def print_quakes(detected):
  '''prints entries'''
  print("amount detected")
  print(len(detected))
  for index in detected:
    obj=earthquakes.loc[index]
    print("Earthquake detected based on radon anomaly...")
    print(obj[1]) #date of earthquake
    print(obj[2]) #magnitude
    print(obj[3]) #epicenter in km
    print(obj[4]) #lat
    print(obj[5]) #lng
    print(obj[6]) #radon level

df=pd.read_csv(sys.argv[1])
earthquakes=pd.read_csv(sys.argv[2])
anomaly=predict_anomalies(df)
values=get_anomaly_values(df,anomaly)
accuracy(anomaly)
detected=get_detected_earthquakes(earthquakes,values)
print_quakes(detected)
