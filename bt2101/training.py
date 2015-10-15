from nltk.probability import FreqDist, ConditionalFreqDist
from nltk.metrics import BigramAssocMeasures
from nltk.classify import NaiveBayesClassifier

word_fd = FreqDist()
label_word_fd = ConditionalFreqDist()

for word in movie_reviews.words(categories=['pos']):
    word_fd[word.lower()] += 1
    label_word_fd['pos'][word.lower()] += 1
 
for word in movie_reviews.words(categories=['neg']):
    word_fd[word.lower()] += 1
    label_word_fd['neg'][word.lower()] += 1

pos_word_count = label_word_fd['pos'].N()
neg_word_count = label_word_fd['neg'].N()
total_word_count = pos_word_count + neg_word_count
 
word_scores = {}
 
for word, freq in word_fd.items():
    pos_score = BigramAssocMeasures.chi_sq(label_word_fd['pos'][word],
        (freq, pos_word_count), total_word_count)
    neg_score = BigramAssocMeasures.chi_sq(label_word_fd['neg'][word],
        (freq, neg_word_count), total_word_count)
    word_scores[word] = pos_score + neg_score
 
best = sorted(word_scores.items(), key=lambda s: s[1], reverse=True)[:10000]
bestwords = set([w for w, s in best])

def best_word_feats(words):
    return dict([(word, True) for word in words if word in bestwords])

def evaluate_classifier(featx):
    negids = movie_reviews.fileids('neg')
    posids = movie_reviews.fileids('pos')
 
    negfeats = [(featx(movie_reviews.words(fileids=[f])), 'neg') for f in negids]
    posfeats = [(featx(movie_reviews.words(fileids=[f])), 'pos') for f in posids]
 
    negcutoff = int(len(negfeats)*3/4)
    poscutoff = int(len(posfeats)*3/4)
    print(negcutoff)
    
 
    trainfeats = negfeats[:negcutoff] + posfeats[:poscutoff]
    testfeats = negfeats[negcutoff:] + posfeats[poscutoff:]
 
    classifier = NaiveBayesClassifier.train(trainfeats)
    refsets = collections.defaultdict(set)
    testsets = collections.defaultdict(set)
 
    for i, (feats, label) in enumerate(testfeats):
            refsets[label].add(i)
            observed = classifier.classify(feats)
            testsets[observed].add(i)
 
    print( 'accuracy:', nltk.classify.util.accuracy(classifier, testfeats))
    print( 'pos precision:', nltk.metrics.precision(refsets['pos'], testsets['pos']))
    print( 'pos recall:', nltk.metrics.recall(refsets['pos'], testsets['pos']))
    print( 'neg precision:', nltk.metrics.precision(refsets['neg'], testsets['neg']))
    print( 'neg recall:', nltk.metrics.recall(refsets['neg'], testsets['neg']))
    classifier.show_most_informative_features()

evaluate_classifier(best_word_feats)
