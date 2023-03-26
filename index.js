/**
 * 
 * @param {number} lvl 
 * @returns number
 */
function levelToXp(lvl) {
    let finalXpNeeded = 0
    for (i = 1; i < parseInt(lvl); i++) {
        let xpNeeded = (i)*120 + 240
        finalXpNeeded += xpNeeded
    }
    return finalXpNeeded
}

/**
 * 
 * @param {number} lvl 
 * @param {boolean} isPrestige 
 * @returns number
 */
function levelToMessageCount(lvl, isPrestige = false) {
    // xp needed
    let xp = levelToXp(lvl)

    // multis
    let prestigeMulti = 1.2
    
    // final calculation
    let xpPerMessage = 30 * (isPrestige ? prestigeMulti : 1)
    let messagesRequiredForLevel = Math.round(xp / xpPerMessage)

    return messagesRequiredForLevel
}

/**
 * 
 * @param {number} xp 
 * @returns number
 */
function xpToLevel(xp) {
    let all = []
    let allLevelXp = 0
    
    // add the xp needed for every level role (up to 1k) to array
    for (i = 1; i < 1000; i++) {
        let xpNeeded = (i)*120 + 240
        allLevelXp += (xpNeeded)
        all.push(allLevelXp)
    }
    
    // refer to array and get the closest match
    let goal = xp
    var closest = all.reduce(function(prev, curr) {
        let result = (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev)
        return result
    });
    
    // get index of closest match
    let level = all.indexOf(closest)
    // add 1, since array is 0 based
    level += 1

    return level
}

/**
 * 
 * @param {number} messages 
 * @param {boolean} isPrestige 
 * @returns number
 */
function messageCountToLevel(messages = 0, isPrestige = false) {
    // multis
    let prestigeMulti = 1.2

    // convert messages to raw xp
    let xp = messages * (30 * (isPrestige ? prestigeMulti : 1))
    let level = xpToLevel(xp)

    return level
}


function messageCountToXp(messages = 0, isPrestige = false) {
    // multis
    let prestigeMulti = 1.2

    // convert messages to raw xp
    let xp = messages * (30 * (isPrestige ? prestigeMulti : 1))
    
    return xp
}

new DiscordUser({xp: 1111, messages: 10000})



///////////// misc ////////////////

/**
 * 
 * @param {string} input 
 * @param {boolean} newMembersOnly 
 */
function extract(input, newMembersOnly) {
    let reg_hep = newMembersOnly ? /\((?<id>\d{16,20})\) joined  :new:/gmi : /\((?<id>\d{16,20})\) joined  /gmi
    let reg_zep = newMembersOnly ? /:new: <@!(?<id>\d{16,20})> /gmi : /<@!(?<id>\d{16,20})> /gmi

    let matches_hep = input.matchAll(reg_hep)
    let matches_zep = input.matchAll(reg_zep)

    let ids = []

    for (const match of matches_hep) {
        console.log(match.groups.id)
        ids.push(match.groups.id)
    }

    for (const match of matches_zep) {
        console.log(match.groups.id)
        ids.push(match.groups.id)
    }

    return ids
}