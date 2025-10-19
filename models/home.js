const { getDB } = require('../utils/databseUtil');
const { ObjectId } = require('mongodb');

module.exports = class Home {
  constructor(HouseName, HouseNumber, Price, location, rating, description, _id) {
    this.HouseName = HouseName;
    this.HouseNumber = HouseNumber;
    this.Price = Price;
    this.location = location;
    this.rating = rating;
    this.description = description;
    if (_id) this._id = new ObjectId(_id);
  }

  save() {
    const db= getDB();
    console.log(`this id: ${this._id}`);
    if(this._id){
      //update
      const updated_field = {
        HouseName: this.HouseName,
        Price:this.Price,
        Location:this.Location,
        rating:this.rating,
        description:this.description
      }
      //because _id cannot be updated again
      console.log(`updated field: ${updated_field.HouseName}`);
      return db.collection('homes').updateOne(
        {_id:new ObjectId(String(this._id))},
        {$set:updated_field}
      )
    }else{
      //insert
      return db.collection("homes").insertOne(this);
    }
  }
  static fetchAll() {
    const db = getDB();
    return db.collection('homes').find().toArray();
  }
  
  static findById(homeId) {
    const db = getDB();
    console.log(homeId);
    return db.collection('homes').find({_id:new ObjectId(String(homeId))}).next();
  }

  // Update an existing home by id and persist changes
  static updateById(homeId, updatedData) {
    const db = getDB();
    return db
      .collection('homes')
      .updateOne({ _id: new ObjectId(homeId) }, { $set: updatedData });
  }

  static deleteById(homeId) {
    const db = getDB();
    return db.collection('homes').deleteOne({ _id: new ObjectId(String(homeId)) });
  }
};
/*
  A static method or property belongs to the class itself, not to instances (objects).
  You cannot access a static method/property from an object — only from the class.
  class_name.method(props);
*/
