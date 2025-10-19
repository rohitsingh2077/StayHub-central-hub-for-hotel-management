const { getDB } = require('../utils/databseUtil');
const { ObjectId } = require('mongodb');

module.exports = class Favourite {
  static async addToFavourite(_id) {
    const db = getDB();
    const homeObjectId= new ObjectId(_id);
    console.log(homeObjectId);
    const existing = await db.collection('favourites').findOne({homeId:homeObjectId});
    if(existing){
      console.log(`Already exisits`);
      return {message: "already exist in favs"};
    }
    else{
      return db.collection('favourites').insertOne({homeId:homeObjectId} );
    }
  }
  static getFavourite() {
    const db = getDB();
    // return the joined home documents by looking up homes collection
    return db.collection('favourites').aggregate([
      { $lookup: {
          from: 'homes',
          localField: 'homeId',
          foreignField: '_id',
          as: 'home'
        }
      },
      { $unwind: '$home' },
      { $replaceRoot: { newRoot: '$home' } }
    ]).toArray();
  }

  static removeFavourites(homeId) {
    const db = getDB();
    try {
      const objId = typeof homeId === 'string' ? new ObjectId(String(homeId)) : homeId;
      return db.collection('favourites').deleteMany({ homeId: objId });
    } catch (err) {
      // if invalid id, return a resolved promise with 0 deletions
      return Promise.resolve({ deletedCount: 0 });
    }
  }
};
/*
  A static method or property belongs to the class itself, not to instances (objects).
  You cannot access a static method/property from an object — only from the class.
  class_name.method(props);
*/
