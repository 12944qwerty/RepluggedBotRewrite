import { userExists, addUser } from '../db/mongo.js';

export async function handleMemberUpdate(member) {

    // member.roles.cache.forEach(role => {
    //     if (role === member.guild.roles.premiumSubscriberRole) {
    //         console.log('a');
    //     } else {
    //         console.log('b');
    //     }
    // });
    console.log('a');
    if (!(await userExists(member.id))) {
        await addUser(member);
        console.log('fired');
    }

}