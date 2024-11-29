from Sastrawi.Stemmer.StemmerFactory import StemmerFactory
from nltk.corpus import stopwords
import re
import nltk
from nltk.stem.porter import PorterStemmer
import pickle
nltk.download('stopwords')

def preprocess(line):
    factory = StemmerFactory()
    stemmer = factory.create_stemmer()
    review = re.sub('[^a-zA-Z]', ' ', line) #leave only characters from a to z
    review = review.lower() #lower the text
    review = review.split() #turn string into list of words
    #apply Stemming
    review = [stemmer.stem(word) for word in review if not word in stopwords.words('indonesian')] #delete stop words like I, and ,OR   review = ' '.join(review)
    #trun list into sentences
    return " ".join(review)

def token(path):
    with open(path, 'rb') as handle:
        tokener = pickle.load(handle)
    return tokener

def labelencode(path):
    with open(path, "rb") as labelen:
        label = pickle.load(labelen)
    return label
