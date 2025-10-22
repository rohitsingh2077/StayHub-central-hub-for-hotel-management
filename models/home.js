const { getDB } = require("../utils/databseUtil");
const { ObjectId } = require("mongodb");

const sqldb = require('../utils/sqldb')

module.exports = class Home {
  constructor(
    HouseName,
    HouseNumber,
    Price,
    location,
    rating,
    description,
    _id,
    host_id
  ) {
    this.HouseName = HouseName;
    this.HouseNumber = HouseNumber;
    this.Price = Price;
    this.location = location;
    this.rating = rating;
    this.description = description;
    if (_id) this._id = new ObjectId(_id);
    this.host_id = host_id;
  }

  save(host_id) {
    const db = getDB();
    console.log(`this id: ${this._id}`);
    if (this._id) {
      //update
      const updated_field = {
        HouseName: this.HouseName,
        Price: this.Price,
        location: this.location,
        rating: this.rating,
        description: this.description,
        host_id: host_id,
      };
      //because _id cannot be updated again
      console.log(`updated field: ${updated_field.HouseName}`);
      return db
        .collection("homes")
        .updateOne(
          { _id: new ObjectId(String(this._id)) },
          { $set: updated_field }
        );
    } else {
      //insert
      return db.collection("homes").insertOne(this);
    }
  }
  static fetchAll() {
    const db = getDB();
    return db.collection("homes").find().toArray();
  }
  static fetchAllHostHomes(host_id) {
    const db = getDB();
    console.log(`feching host homes for ${host_id}`);
    //now what to do ?
    return db.collection("homes").find({ host_id: host_id }).toArray();
  }

  static findById(homeId) {
    const db = getDB();
    console.log(homeId);
    return db
      .collection("homes")
      .find({ _id: new ObjectId(String(homeId)) })
      .next();
  }

  // Update an existing home by id and persist changes
  static updateById(homeId, updatedData) {
    const db = getDB();
    return db
      .collection("homes")
      .updateOne({ _id: new ObjectId(homeId) }, { $set: updatedData });
  }

  static deleteById(homeId) {
    const db = getDB();
    //tried to made the operation atomic so all the presence are deleted
    //ofc this thing wont work in big prowject but it will work here
    /*
    one thing which can be done is maintaining a queue whihch will be shown as notification to user
    once the user visits..like the first thing at home page but will do it later
    */
    return db
      .collection("homes")
      .deleteOne({ _id: new ObjectId(String(homeId))})
      .then((result) => {
        console.log("Deleted from MongoDB:", result.deletedCount);
        //HOMES ARE DELETED FROM MONGOBD BUT NOT FROM SQL
        // Step 2: Delete from SQL favorites ... okay i was not importing sqldb lol 
        return sqldb.execute("DELETE FROM favourites WHERE home_id = ?", [
          homeId,
        ]);
      })
      .then(([sqlResult]) => {
        console.log("Deleted from SQL favourites:", sqlResult.affectedRows);
      })
      .catch((err) => {
        console.error("Error deleting home:", err);
      });
  }
};
/*
  A static method or property belongs to the class itself, not to instances (objects).
  You cannot access a static method/property from an object — only from the class.
  class_name.method(props);
*/

/*
I can store (host,home) in a seperate table in sql and then extract data from there...
so 
sql -> (host-home-list and favourites list and all users list)
mongodb -> (session , home details)
*/
