import pandas as pd
import numpy as np
import re
import pickle

def cleaning(text):
    processed_text = re.sub(r'[^a-zA-Z\s]', '', text)
    processed_text = re.sub(' +', ' ', processed_text).strip()
    return processed_text

def token(path : str):
    with open(path, 'rb') as handle:
        tokener = pickle.load(handle)
    return tokener

def labelencode(path : str):
    with open(path, "rb") as labelen:
        label = pickle.load(labelen)
    return label

    