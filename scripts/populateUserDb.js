const { db } = require('../services/firestore');
const DB_COLLECTION_NAME= "LGR_Users";

const createProfile = ({username, id}) => {
    db.collection(DB_COLLECTION_NAME).doc(`${id}`).set({
        wallet: 0,
        inviteFrom: userToInviteFrom[id]||"",
        username
    })
}
