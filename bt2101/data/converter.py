import nltk
import pickle
from nltk.stem.porter import PorterStemmer
from nltk.corpus import stopwords

def convert(file):
    f = open("original data/"+file+"reevoodata.csv",'rb')
    ##for row in f:
    ##    row = str(row)
    ##    print(row[1:-5])
    pos = open("./positive.csv", 'w')
    neg = open("./negative.csv", 'w')
    def check(string):
        if string == "" or "none" in string or "nil" in string:
            return False
        return True
        
    for row in f:
        flag = True
        row = str(row)
        if "|#|" not in row:
            continue
        try:
            rating, positive, negative = row[1:-5].split("|#|")
            negative = negative.lower()
        except:
            rating,positive = row.split("|#|")
            flag = False
        positive = positive.lower()
        if check(positive):
            pos.write(positive+"\n")
##            print("wrote into pos: ", positive)
        if flag and check(negative):
            neg.write(negative+"\n")
##            print("worte into neg: ", negative)
    pos.close()
    neg.close()
    f.close()

##convert("canon")

def pos():
    f = open("./positive.csv", "r")
    i=0
    for row in f:
        i+=1
##        print(row)
    f.close()
    print(i)
    
def neg():
    f = open("./negative.csv","r")
    i=0
    for row in f:
        i+=1
        print(row)
    f.close()
    print(i)

##pos()
##neg()
