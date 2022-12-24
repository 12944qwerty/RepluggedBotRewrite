

export async function handleMemberLeave(member) {
    if (member.premiumSince) {
        console.log('fuck');
    }
    console.log(member.roles.cache);
    console.log('hi');

    for (const i in member.roles.cache) {
        console.log(i);
    }

}