// A lot of this code was made with oly's help, so thanks to him for that. (Olykir#0193) https://github.com/LandenStephenss

/** The bitfield to badge table */
const bitTable = {
    // Developer status. Public
    DEVELOPER: 1 << 0,
    // Admin status. Public
    ADMIN: 1 << 1,
    // Staff status. Public
    STAFF: 1 << 2,
    // Moderator status. Public
    MODERATOR: 1 << 3,
    // Support status. Public
    SUPPORT: 1 << 4,
    // Contributor status. Public
    CONTRIBUTOR: 1 << 5,
    // Translator status. Public
    TRANSLATOR: 1 << 6,
    // Bug hunter status. Public
    BUG_HUNTER: 1 << 7,
    // Early user status. Public
    EARLY_USER: 1 << 8,
    // User is a booster. Public.
    SERVER_BOOSTER: 1 << 27,

    // User currently has a published item in the store. Public.
    STORE_PUBLISHER: 1 << 12,
    // User has at least one verified item in the store. Public.
    VERIFIED_PUBLISHER: 1 << 13,

    // User is banned from logging in. Private.
    BANNED: 1 << 14,
    // User is banned from publishing in the store. Private.
    BANNED_PUBLISHER: 1 << 15,
    // User is banned from requesting verification. Private.
    BANNED_VERIFICATION: 1 << 16,
    // User is banned from requesting hosting. Private.
    BANNED_HOSTING: 1 << 17,
    // User is banned from submitting reports. Private.
    BANNED_REPORTING: 1 << 18,
    // User is banned from using Sync. Private.
    BANNED_SYNC: 1 << 19,
    // User is banned from participating in community events. Private.
    BANNED_EVENTS: 1 << 20,

    // User appealed a support ban. Private.
    APPEALED_SUPPORT: 1 << 21,
    // User appealed a server mute. Private.
    APPEALED_MUTE: 1 << 22,
    // User appealed a server ban. Private.
    APPEALED_BAN: 1 << 23,
    // User appealed a Sync ban. Private.
    APPEALED_SYNC: 1 << 24,
    // User appealed a community events ban. Private.
    APPEALED_EVENTS: 1 << 25,

    // User is a ghost entry (entry with no real user data, used for flag keeping purposes). Private.
    GHOST: 1 << 26,
};

/**
 * This function returns the values for a bitfield
 * @param {number} bitfield The bitfield to get values for
 * @returns {object} The bitfield converted to an object
 * @notes 0 = badge | 1 = banned | 2 = appealed | 3 = ghost
*/

export function readBits(bits) {
    return {
        badge: {
            developer: (bits & bitTable.DEVELOPER) !== 0,
            staff: (bits & bitTable.STAFF) !== 0,
            support: (bits & bitTable.SUPPORT) !== 0,
            contributor: (bits & bitTable.CONTRIBUTOR) !== 0,
            translator: (bits & bitTable.TRANSLATOR) !== 0,
            bugHunter: (bits & bitTable.BUG_HUNTER) !== 0,
            earlyUser: (bits & bitTable.EARLY_USER) !== 0,
            booster: (bits & bitTable.SERVER_BOOSTER) !== 0,
        },
        banned: {
            banned: (bits & bitTable.BANNED) !== 0,
            bannedPublisher: (bits & bitTable.BANNED_PUBLISHER) !== 0,
            bannedVerification: (bits & bitTable.BANNED_VERIFICATION) !== 0,
            bannedHosting: (bits & bitTable.BANNED_HOSTING) !== 0,
            bannedReporting: (bits & bitTable.BANNED_REPORTING) !== 0,
            bannedSync: (bits & bitTable.BANNED_SYNC) !== 0,
            bannedEvents: (bits & bitTable.BANNED_EVENTS) !== 0,
        },
        appealed: {
            appealedSupport: (bits & bitTable.APPEALED_SUPPORT) !== 0,
            appealedMute: (bits & bitTable.APPEALED_MUTE) !== 0,
            appealedBan: (bits & bitTable.APPEALED_BAN) !== 0,
            appealedSync: (bits & bitTable.APPEALED_SYNC) !== 0,
            appealedEvents: (bits & bitTable.APPEALED_EVENTS) !== 0,
        },
        ghost: (bits & bitTable.GHOST) !== 0,

    };

}

/**
 * This function updates the values for a bitfield
 * @param {object} values The values to update the bitfield with
 * @param {number} bitfield The bitfield to update
 * @returns {number} The updated bitfield
 * @example updateBits({ badge: { developer: true } }, 0) // 1
 * @example updateBits({ banned: { banned: true } }, 0) // 16384
 * @todo make this not a steaming pile of shit
 */
export function updateBits(values, bits) {
    if (values.badge) {
        if (values.badge.developer) bits |= bitTable.DEVELOPER;
        if (values.badge.staff) bits |= bitTable.STAFF;
        if (values.badge.support) bits |= bitTable.SUPPORT;
        if (values.badge.contributor) bits |= bitTable.CONTRIBUTOR;
        if (values.badge.translator) bits |= bitTable.TRANSLATOR;
        if (values.badge.bugHunter) bits |= bitTable.BUG_HUNTER;
        if (values.badge.earlyUser) bits |= bitTable.EARLY_USER;
        if (values.badge.booster) bits |= bitTable.SERVER_BOOSTER;
    }
    if (values.banned) {
        if (values.banned.banned) bits |= bitTable.BANNED;
        if (values.banned.bannedPublisher) bits |= bitTable.BANNED_PUBLISHER;
        if (values.banned.bannedVerification) bits |= bitTable.BANNED_VERIFICATION;
        if (values.banned.bannedHosting) bits |= bitTable.BANNED_HOSTING;
        if (values.banned.bannedReporting) bits |= bitTable.BANNED_REPORTING;
        if (values.banned.bannedSync) bits |= bitTable.BANNED_SYNC;
        if (values.banned.bannedEvents) bits |= bitTable.BANNED_EVENTS;
    }
    if (values.appealed) {
        if (values.appealed.appealedSupport) bits |= bitTable.APPEALED_SUPPORT;
        if (values.appealed.appealedMute) bits |= bitTable.APPEALED_MUTE;
        if (values.appealed.appealedBan) bits |= bitTable.APPEALED_BAN;
        if (values.appealed.appealedSync) bits |= bitTable.APPEALED_SYNC;
        if (values.appealed.appealedEvents) bits |= bitTable.APPEALED_EVENTS;
    }
    if (values.ghost) bits |= bitTable.GHOST;
    return bits;
    // Thank fuck for GitHub CoPilot
}