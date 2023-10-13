import bson
from pymongo import MongoClient
import os

DB_BACKUP_DIR = 'backend\\config\\backup'
conn = MongoClient("mongodb+srv://admin:Password@dbblogid.h1zf0oa.mongodb.net/", authSource="admin")
db_name = 'Blogs'
collections = ['articles', 'comments', 'subscriptions', 'users', 'usersubscriptions']


# def dump(collections, conn, db_name, path):
#     db = conn[db_name]
#     for coll in collections:
#         print(db[coll].find())
#         with open(os.path.join(path, f'{coll}.bson'), 'wb+') as f:
#             for doc in db[coll].find():
#                 f.write(bson.BSON.encode(doc))

# dump(collections, conn, db_name, DB_BACKUP_DIR)

# def restore(path, conn, db_name):
    
#     db = conn[db_name]
#     for coll in os.listdir(path):
#         if coll.endswith('.bson'):
#             with open(os.path.join(path, coll), 'rb+') as f:
#                 db[coll.split('.')[0]].insert_many(bson.decode_all(f.read()))

# restore(DB_BACKUP_DIR, conn, db_name)