const { getDB } = require("../utils/databseUtil");
const { ObjectId } = require("mongodb");
const sqldb = require("../utils/sqldb");
module.exports = class Favourite {
  static async addToFavourite(userId, homeId) {
    try {
      await sqldb.execute(
        "INSERT INTO favourites (user_id, home_id) VALUES (?, ?)",
        [userId, homeId]
      );
      console.log("Added to favourites");
      return { success: true };
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        console.log("Already exists in favourites");
        return { message: "Already in favourites" };
      } else {
        throw err;
      }
    }
  }

  static getFavourite(userId) {
    const db = getDB();
    //entire promise chain ko return karna padta hai
    return sqldb
      .execute(`select home_id from favourites where user_id = ?`, [userId])
      .then(([rows]) => {
        //rows of house given in promise now getting details about all the houses
        //integrating mongodb fucked up my project
        //but there is no going back now
        if (rows.length === 0) {
          console.log(`no home found`);
          return Promise.resolve([]);
        }

        const homeIds = rows.map((r) => new ObjectId(r.home_id));
        return db
          .collection("homes")
          .find({ _id: { $in: homeIds } })
          .toArray();
      })
      .then((favList) => {
        return favList;
      })
      .catch((err) => {
        console.error("Error fetching favorites:", err);
      });
  }

  static removeFavourites(userId,homeId) {
    // const db = getDB();
    // try {
    //   const objId =
    //     typeof homeId === "string" ? new ObjectId(String(homeId)) : homeId;
    //   return db.collection("favourites").deleteMany({ homeId: objId });
    // } catch (err) {
    //   // if invalid id, return a resolved promise with 0 deletions
    //   return Promise.resolve({ deletedCount: 0 });
    // }
    return sqldb
      .execute(`delete from favourites where user_id = ? and home_id = ?`, [
        userId,
        homeId,
      ]);
  }
};
/*
  A static method or property belongs to the class itself, not to instances (objects).
  You cannot access a static method/property from an object — only from the class.
  class_name.method(props);
*/
