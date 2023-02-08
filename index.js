/**
 * 
 * @param {number} _lvl 
 * @returns number
 */
function levelToXp(_lvl) {
    let finalXpNeeded = 0
    for (i = 1; i < parseInt(_lvl); i++) {
        let xpNeeded = (i)*120 + 240
        finalXpNeeded += xpNeeded
    }
    return finalXpNeeded
}

/**
 * 
 * @param {number} _lvl 
 * @param {boolean} _isPrestige 
 * @returns number
 */
function levelToMessageCount(_lvl, _isPrestige = false) {
    // xp needed
    let xp = levelToXp(_lvl)

    // multis
    let prestigeMulti = 1.2
    
    // final calculation
    let xpPerMessage = 30 * (_isPrestige ? prestigeMulti : 1)
    let messagesRequiredForLevel = Math.round(xp / xpPerMessage)

    return messagesRequiredForLevel
}

/**
 * 
 * @param {number} _xp 
 * @returns number
 */
function xpToLevel(_xp) {
    let all = []
    let allLevelXp = 0
    
    // add the xp needed for every level role (up to 1k) to array
    for (i = 1; i < 1000; i++) {
        let xpNeeded = (i)*120 + 240
        allLevelXp += (xpNeeded)
        all.push(allLevelXp)
    }
    
    // refer to array and get the closest match
    let goal = _xp
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
 * @param {number} _messages 
 * @param {boolean} _isPrestige 
 * @returns number
 */
function messageCountToLevel(_messages, _isPrestige = false) {
    // multis
    let prestigeMulti = 1.2

    // convert messages to raw xp
    let xp = _messages * (30 * (_isPrestige ? prestigeMulti : 1))
    let level = xpToLevel(xp)

    return level
}

new DiscordUser({xp: 1111, messages: 10000})