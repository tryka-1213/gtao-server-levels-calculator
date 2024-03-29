/**
 * 
 * @param {number} lvl 
 * @returns number
 */
function levelToXp(lvl) {
    let finalXpNeeded = 0
    // limited to only showing xp up to rank 999, otherwise function will hang if input is too big
    for (i = 1; i < (parseInt(lvl) > 999 ? 999 : parseInt(lvl)); i++) {
        let xpNeeded = (i)*120 + 240
        finalXpNeeded += xpNeeded
    }
    return finalXpNeeded || 0
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

    return messagesRequiredForLevel || 0
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

    return level || 0
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

    return level || 0
}

/**
 * 
 * @param {number} messages 
 * @param {boolean} isPrestige 
 * @returns number
 */
function messageCountToXp(messages = 0, isPrestige = false) {
    // multis
    let prestigeMulti = 1.2

    // convert messages to raw xp
    let xp = messages * (30 * (isPrestige ? prestigeMulti : 1))
    
    return xp || 0
}




// Non level related methods

/**
 * 
 * @param {string} input 
 * @param {boolean} newMembersOnly 
 * @returns array[]
 */
function extract(input, newMembersOnly) {
    let reg_hep = newMembersOnly ? /\((?<id>\d{16,20})\) joined  :new:/gmi : /\((?<id>\d{16,20})\) joined  /gmi
    let reg_zep = newMembersOnly ? /:new: <@!(?<id>\d{16,20})> /gmi : /<@!(?<id>\d{16,20})> /gmi

    let regexes = [reg_hep, reg_zep]

    let ids = []

    regexes.forEach(regex => {
        let matches = input.matchAll(regex)
        for (const match of matches) {
            ids.push(match.groups.id)
        }
    })
    
    return ids || []
}



/**
 * 
 * @param {string} string 
 * @returns {boolean}
 */
function willLfgFilter(string) {
    // 3+ new lines
    let reg_lines = /([^]+\n){2,}/gmi 
    // 3+ emojis
    let reg_emojis = /(\p{RI}\p{RI}|\p{Emoji}(\p{EMod}+|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?(\u{200D}\p{Emoji}(\p{EMod}+|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?)+|\p{EPres}(\p{EMod}+|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?|\p{Emoji}(\p{EMod}+|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})|(<\s*?:[a-zA-Z0-9_\.\-#$]+:[0-9]{16,}>\s*?)|:[a-zA-Z0-9_\.\-#$]+:)/ugmi
    // n word
    let reg_nword = /\b([sŚśṤṥŜŝŠšṦṧṠṡŞşṢṣṨṩȘșS̩s̩ꞨꞩⱾȿꟅʂᶊᵴ][a4ÁáÀàĂăẮắẰằẴẵẲẳÂâẤấẦầẪẫẨẩǍǎÅåǺǻÄäǞǟÃãȦȧǠǡĄąĄ́ą́Ą̃ą̃ĀāĀ̀ā̀ẢảȀȁA̋a̋ȂȃẠạẶặẬậḀḁȺⱥꞺꞻᶏẚＡａ][nŃńǸǹŇňÑñṄṅŅņṆṇṊṋṈṉN̈n̈ƝɲŊŋꞐꞑꞤꞥᵰᶇɳȵꬻꬼИиПпＮｎ][dĎďḊḋḐḑD̦d̦ḌḍḒḓḎḏĐđÐðƉɖƊɗᵭᶁᶑȡ])*[nŃńǸǹŇňÑñṄṅŅņṆṇṊṋṈṉN̈n̈ƝɲŊŋꞐꞑꞤꞥᵰᶇɳȵꬻꬼИиПпＮｎ]+[i!/\\Ííi̇́Ììi̇̀ĬĭÎîǏǐÏïḮḯĨĩi̇̃ĮįĮ́į̇́Į̃į̇̃ĪīĪ̀ī̀ỈỉȈȉI̋i̋ȊȋỊịꞼꞽḬḭƗɨᶖİiIıＩｉ1lĺľļḷḹl̃ḽḻłŀƚꝉⱡɫɬꞎꬷꬸꬹᶅɭȴＬｌoÓóÒòŎŏÔôỐốỒồỖỗỔổǑǒÖöȪȫŐőÕõṌṍṎṏȬȭȮȯO͘o͘ȰȱØøǾǿǪǫǬǭŌōṒṓṐṑỎỏȌȍȎȏƠơỚớỜờỠỡỞởỢợỌọỘộO̩o̩Ò̩ò̩Ó̩ó̩ƟɵꝊꝋꝌꝍⱺＯｏІіa4ÁáÀàĂăẮắẰằẴẵẲẳÂâẤấẦầẪẫẨẩǍǎÅåǺǻÄäǞǟÃãȦȧǠǡĄąĄ́ą́Ą̃ą̃ĀāĀ̀ā̀ẢảȀȁA̋a̋ȂȃẠạẶặẬậḀḁȺⱥꞺꞻᶏẚＡａ]*[gǴǵĞğĜĝǦǧĠġG̃g̃ĢģḠḡǤǥꞠꞡƓɠᶃꬶＧｇqꝖꝗꝘꝙɋʠ9]+(l[e3€ЄєЕеÉéÈèĔĕÊêẾếỀềỄễỂểÊ̄ê̄Ê̌ê̌ĚěËëẼẽĖėĖ́ė́Ė̃ė̃ȨȩḜḝĘęĘ́ę́Ę̃ę̃ĒēḖḗḔḕẺẻȄȅE̋e̋ȆȇẸẹỆệḘḙḚḛɆɇE̩e̩È̩è̩É̩é̩ᶒⱸꬴꬳＥｅ]+[try]+|[e3€ЄєЕеÉéÈèĔĕÊêẾếỀềỄễỂểÊ̄ê̄Ê̌ê̌ĚěËëẼẽĖėĖ́ė́Ė̃ė̃ȨȩḜḝĘęĘ́ę́Ę̃ę̃ĒēḖḗḔḕẺẻȄȅE̋e̋ȆȇẸẹỆệḘḙḚḛɆɇE̩e̩È̩è̩É̩é̩ᶒⱸꬴꬳＥｅa4ÁáÀàĂăẮắẰằẴẵẲẳÂâẤấẦầẪẫẨẩǍǎÅåǺǻÄäǞǟÃãȦȧǠǡĄąĄ́ą́Ą̃ą̃ĀāĀ̀ā̀ẢảȀȁA̋a̋ȂȃẠạẶặẬậḀḁȺⱥꞺꞻᶏẚＡａ]*[rŔŕŘřṘṙŖŗȐȑȒȓṚṛṜṝṞṟR̃r̃ɌɍꞦꞧⱤɽᵲᶉꭉ]*|n[ÓóÒòŎŏÔôỐốỒồỖỗỔổǑǒÖöȪȫŐőÕõṌṍṎṏȬȭȮȯO͘o͘ȰȱØøǾǿǪǫǬǭŌōṒṓṐṑỎỏȌȍȎȏƠơỚớỜờỠỡỞởỢợỌọỘộO̩o̩Ò̩ò̩Ó̩ó̩ƟɵꝊꝋꝌꝍⱺＯｏ0]+[gǴǵĞğĜĝǦǧĠġG̃g̃ĢģḠḡǤǥꞠꞡƓɠᶃꬶＧｇqꝖꝗꝘꝙɋʠ]+|[a4ÁáÀàĂăẮắẰằẴẵẲẳÂâẤấẦầẪẫẨẩǍǎÅåǺǻÄäǞǟÃãȦȧǠǡĄąĄ́ą́Ą̃ą̃ĀāĀ̀ā̀ẢảȀȁA̋a̋ȂȃẠạẶặẬậḀḁȺⱥꞺꞻᶏẚＡａ]*)*[sŚśṤṥŜŝŠšṦṧṠṡŞşṢṣṨṩȘșS̩s̩ꞨꞩⱾȿꟅʂᶊᵴ]*\b/gmi
    
    var totalMatches = []

    if ((string.match(reg_lines) || []).length > 0) totalMatches.push(string.match(reg_lines))
    if ((string.match(reg_emojis) || []).length >= 3) totalMatches.push(string.match(reg_emojis))
    if ((string.match(reg_nword) || []).length > 0) totalMatches.push(string.match(reg_nword))
    
    return totalMatches.length > 0
    // return reg_lines.test(string) || reg_emojis.test(string)
}
