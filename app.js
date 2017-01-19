var express = require('express');
var app = express();
var _ = require('lodash');


function process_attack(player, monster, monstertype) {

    var damageReduction = (1 - (player.defence * .015));
    var damage_taken_min = (monster.monsterbasedamageMin * damageReduction).toFixed(2);
    var damage_taken_max = (monster.monsterbasedamageMax * damageReduction).toFixed(2);
    var damage_taken = _.random(damage_taken_min, damage_taken_max);
    var damageMultiplier = (1 + (player.strength * .015));
    var adjustedbasedamageMax = (player.basedamagemax * damageMultiplier).toFixed(2);
    var adjustedbasedamageMin = (player.basedamagemin * damageMultiplier).toFixed(2);
    var damage_given = _.random(adjustedbasedamageMin, adjustedbasedamageMax);

    if (monstertype == "Belinda") {
        damage_given = (damage_given / 2);
    }

    var player_hp = (player.hp -= damage_taken);
    var adjusted_player_hp = _.round(player_hp, 2);
    var updated_player = {
        hp: adjusted_player_hp
    }
    var updated_monster = {
        monsterHP: (monster.monsterHP -= damage_given).toFixed(2)
    }

    return {
        updated_vars: {
            player: updated_player,
            monster: updated_monster
        },
        damage: {
            damage_taken: damage_taken,
            damage_given: damage_given
        },
    }
}


function process_health_bar(player, monster) {

    var player_bar = ((player.hp / player.maxhp) * 100);
    var player_bar_array = [];

    for (var i = 0; i <= player_bar; i += 10) {
        if (player.hp > 0) {
            player_bar_array.push('▮');
        }
    }

    for (var i = 100; i >= player_bar; i -= 10) {
        player_bar_array.push('▯');
    }

    var monster_bar = ((monster.monsterHP / monster.monsterHPMax) * 100);
    var monster_bar_array = [];

    for (var i = 0; i <= monster_bar; i += 10) {
        if (monster.monsterHP > 0) {
            monster_bar_array.push('▮');
        }
    }

    for (var i = 100; i >= monster_bar; i -= 10) {
        monster_bar_array.push('▯');
    }

    var monster_health_bar = monster_bar_array.join('');
    var monster_health_bar_final = monster_health_bar.substring(0, 10);
    var player_health_bar = player_bar_array.join('');
    var player_health_bar_final = player_health_bar.substring(0, 10);
    var array = [];

    array[0] = player_health_bar_final;
    array[1] = monster_health_bar_final;

    return (array);

}

function process_stats_bar(player) {

    var array = [];
    var player_bar = ((player.hp / player.maxhp) * 100);
    var player_bar_array = [];

    for (var i = 1; i <= player_bar; i += 10) {
        if (player.hp > 0) {
            player_bar_array.push('▮');
        }
    }

    for (var i = 100; i >= player_bar; i -= 10) {
        if (player.hp > 0) {
            player_bar_array.push('▯');
        }
    }

    var player_health_bar = player_bar_array.join('');
    var player_health_bar_final = player_health_bar.substring(0, 10);

    array[0] = player_health_bar_final;

    var strength = (player.strength / 50) * 50;
    var strength_bar_array = [];

    for (var i = 5; i <= strength; i += 5) {
        strength_bar_array.push('▮');
    }


    for (var i = 50; i >= strength; i -= 5) {
        strength_bar_array.push('▯');
    }

    var strength_bar = strength_bar_array.join('');
    var strength_bar_final = strength_bar.substring(0, 10);

    array[1] = strength_bar_final;

    var defence = (player.defence / 50) * 50
    var defence_bar_array = [];

    for (var i = 5; i <= defence; i += 5) {
        defence_bar_array.push('▮');
    }
    for (var i = 50; i >= defence; i -= 5) {
        defence_bar_array.push('▯');
    }

    var defence_bar = defence_bar_array.join('');
    var defence_bar_final = defence_bar.substring(0, 10);

    array[2] = defence_bar_final;

    var weapon_bar_array = [];

    if (player.weapon == 'bronze sword') {
        weapon_bar_array.push('▮', '▮', '▯', '▯');
    } else if (player.weapon == 'silver sword') {
        weapon_bar_array.push('▮', '▮', '▮', '▯');
    } else if (player.weapon == 'gold sword') {
        weapon_bar_array.push('▮', '▮', '▮', '▮');
    } else {
        weapon_bar_array.push('▮', '▯', '▯', '▯');
    }

    var weapon_bar = weapon_bar_array.join('');

    array[3] = weapon_bar;

    var pumpkin_piece_array = [];
    var pumpkinpieces = player.pumpkinpieces

    if (pumpkinpieces == 0) {
        pumpkin_piece_array.push('▯', '▯', '▯');
    } else if (pumpkinpieces == 1) {
        pumpkin_piece_array.push('▮', '▯', '▯');
    } else if (pumpkinpieces == 2) {
        pumpkin_piece_array.push('▮', '▮', '▯');
    } else {
        pumpkin_piece_array.push('▮', '▮', '▮');
    }
    var pumpkin_final = pumpkin_piece_array.join('');
    array[4] = pumpkin_final;
    return (array);
}

function process_slain(player, monstertype) {

    var chance = Math.random();
    var startingpotions = player.potions;
    var startingcandy = player.halloweencandy;
    var updated_player = {};

    if (monstertype == 'Zombie') {
        updated_player.potions = (player.potions += 2);
        updated_player.halloweencandy = (player.halloweencandy += 3)
    } else if (monstertype == 'Mummy') {
        updated_player.potions = (player.potions += 3)
        updated_player.halloweencandy = (player.halloweencandy += 4);
    } else if (monstertype == 'Wolfman') {
        updated_player.potions = (player.potions += 5);
        updated_player.halloweencandy = (player.halloweencandy += 6);
    } else if (monstertype == 'Demon') {
        updated_player.potions = (player.potions += 8);
        updated_player.halloweencandy = (player.halloweencandy += 9);
    } else if (monstertype == 'Spectre') {
        updated_player.potions = (player.potions += 7);
        updated_player.halloweencandy = (player.halloweencandy += 7);
    } else if (monstertype == 'Ghoul') {
        updated_player.potions = (player.potions += 4);
        updated_player.halloweencandy = (player.halloweencandy += 5);
    } else if (monstertype == 'Goblin') {
        updated_player.potions = (player.potions += 2);
        updated_player.halloweencandy = (player.halloweencandy += 2);
    } else if (monstertype == 'Ghost') {
        updated_player.potions = (player.potions += 6);
        updated_player.halloweencandy = (player.halloweencandy += 6);
    } else if (monstertype == 'Belinda') {
        updated_player.potions = (player.potions += 9);
        updated_player.halloweencandy = (player.halloweencandy += 12);
        updated_player.Belinda = 1;
        updated_player.pumpkinpieces = (player.pumpkinpieces + 1);
    } else if (monstertype == 'Hazel') {
        updated_player.potions = (player.potions += 9);
        updated_player.halloweencandy = (player.halloweencandy += 12);
        updated_player.Hazel = 1;
        updated_player.pumpkinpieces = (player.pumpkinpieces + 1);
    } else if (monstertype == 'Baba-Yaga') {
        updated_player.potions = (player.potions += 9);
        updated_player.halloweencandy = (player.halloweencandy += 12);
        updated_player.Hermione = 1;
        updated_player.pumpkinpieces = (player.pumpkinpieces + 1);
    } else if (monstertype == "Spirit-of-Halloween") {
        updated_player.potions = (player.potions += 12);
        updated_player.halloweencandy = (player.halloweencandy += 12);
    }

    var drops = {};

    drops.pot = (updated_player.potions - startingpotions);
    if (drops.pot > 0) {
        drops.pot = drops.pot;
    } else {
        drops.pot = 0;
    }
    drops.candy = (updated_player.halloweencandy - startingcandy)

    return {
        updated_vars: { player: updated_player },
        dropped: { drops },
    }

}


function process_heal(player, potionreq) {

    var health = player.hp + (100 * potionreq);
    var updated_player = {
        potions: player.potions -= potionreq,
        hp: health
    }

    if (updated_player.hp >= player.maxhp) {
        updated_player.hp = player.maxhp
    }

    return {
        updated_vars: { player: updated_player }
    }

}

function check_potions(player) {

    var suggested_responses = [];
    var maxhealth = player.maxhp;
    var health = player.hp;
    var potions = player.potions
    var potions_until_max = Math.ceil((maxhealth - health) / 100);

    suggested_responses.push("1");

    if ((potions >= 2) && (potions_until_max >= 2)) {
        suggested_responses.push("2");
    }

    if ((potions >= 3) && (potions_until_max >= 3)) {
        suggested_responses.push("3");
    }

    if ((potions >= 4) && (potions_until_max >= 4)) {
        suggested_responses.push("4");
    }

    if ((potions >= potions_until_max) && (potions_until_max > 4)) {
        suggested_responses.push(potions_until_max.toString());
    } else if ((potions < potions_until_max) && (potions > 4) && (potions_until_max > 4)) {
        suggested_responses.push(potions.toString());
    }

    return (suggested_responses);

}

function process_run(player) {

    var updated_player = {};
    var candy = (player.halloweencandy - 5)

    if (candy < 0) {

        candy = 0;
    }

    updated_player = {
        halloweencandy: candy
    }

    return {
        updated_vars: { player: updated_player }
    }

}

function process_potion(player) {

    var updated_player = {};
    var pot = (player.potions + 1)

    updated_player = {
        potions: pot
    }

    return {
        updated_vars: { player: updated_player }
    }

}

function process_buy_potions(player, amount) {

    var starting_potions = player.potions;
    var starting_candy = player.halloweencandy;

    if (amount == 'Buy 1' && player.halloweencandy >= 2) {
        var pots = starting_potions + 1
        var candy = starting_candy - 2
    } else if (amount == 'Buy 3' && player.halloweencandy >= 2) {
        var pots = starting_potions + 3
        var candy = starting_candy - 5
    } else if (amount == 'Buy 5' && player.halloweencandy >= 2) {
        var pots = starting_potions + 5
        var candy = starting_candy - 8
    }
    
    var updated_player = {};

    updated_player = {
        potions: pots,
        halloweencandy: candy
    }

    return {
        updated_vars: { player: updated_player }
    };


}

function process_upgrade(player, upgrade) {

    var updated_player = {};
    var candy;

    switch (upgrade) {
        case 'strength':
            var strengthchange = player.strength + 1
            candy = player.halloweencandy - 3
            updated_player = {
                strength: strengthchange,
                halloweencandy: candy
            };
            break;
        case 'defence':
            var defencechange = player.defence + 1;
            candy = player.halloweencandy - 3;
            updated_player = {
                defence: defencechange,
                halloweencandy: candy
            };
            break;
        case 'HP':
            var hpchange = player.hp + 25;
            var maxhpchange = player.maxhp + 25;
            candy = player.halloweencandy - 3;
            updated_player = {
                maxhp: maxhpchange,
                hp: hpchange,
                halloweencandy: candy
            }
            break;
        case 'bronze sword':
            var sword = 'bronze sword';
            var damagemin = 95;
            var damagemax = 110;
            candy = player.halloweencandy - 30;
            updated_player = {
                weapon: sword,
                basedamagemax: damagemax,
                basedamagemin: damagemin,
                halloweencandy: candy
            }
            break;
        case 'silver sword':
            var sword = 'silver sword';
            var damagemin = 115;
            var damagemax = 130;
            candy = player.halloweencandy - 50;
            updated_player = {
                weapon: sword,
                basedamagemax: damagemax,
                basedamagemin: damagemin,
                halloweencandy: candy
            }
            break;
        case 'gold sword':
            var sword = 'gold sword';
            var damagemin = 150;
            var damagemax = 180;
            candy = player.halloweencandy - 100;

            updated_player = {
                weapon: sword,
                basedamagemax: damagemax,
                basedamagemin: damagemin,
                halloweencandy: candy
            }
            break;
        default:
            console.log("error");
    }
    return {
        updated_vars: { player: updated_player }

    }

}


app.get('/explore', function(req, res) {

    try {
        var player = JSON.parse(req.query.player);
        var computerChoice = Math.random();

        if (((player.hp / player.maxhp) < 0.30) && (player.potions < 6)) {
            if (computerChoice < 0.25) {
                computerChoice = "monster";
            } else if (computerChoice < 0.90) {
                computerChoice = "potions";
            } else {
                computerChoice = "nothing";
            }
        } else {
            if (computerChoice <= 0.70) {
                computerChoice = "monster";
            } else if (computerChoice <= 0.85) {
                computerChoice = "nothing";
            } else {
                computerChoice = "potions";
            }
        }

        res.send(computerChoice);

    } catch (e) {
        console.log(e.stack);
        res.sendStatus(400);
    }

});

app.get('/monstertype', function(req, res) {

    try {
        var monsterType = Math.random();

        if (monsterType <= 0.20) {
            monsterType = "Goblin";
            res.send(monsterType);
        } else if (monsterType <= 0.38) {
            monsterType = "Zombie";
            res.send(monsterType);
        } else if (monsterType <= 0.55) {
            monsterType = "Mummy";
            res.send(monsterType);
        } else if (monsterType <= 0.70) {
            monsterType = "Ghost";
            res.send(monsterType);
        } else if (monsterType <= 0.82) {
            monsterType = "Ghoul";
            res.send(monsterType);
        } else if (monsterType <= 0.90) {
            monsterType = "Wolfman";
            res.send(monsterType);
        } else if (monsterType <= 0.97) {
            monsterType = "Spectre";
            res.send(monsterType);
        } else {
            monsterType = "Demon";
            res.send(monsterType);
        }
    } catch (e) {
        console.log(e.stack);
        res.sendStatus(400);
    }

});


app.get('/monsterattack', function(req, res) {

    try {
        var player = JSON.parse(req.query.player);
        var monster = JSON.parse(req.query.monster);
        var monstertype = req.query.monstertype;

        res.json(process_attack(player, monster, monstertype));
    } catch (e) {
        console.log(e.stack);
        res.sendStatus(400);
    }


});


app.get('/foundpotion', function(req, res) {

    try {
        var player = JSON.parse(req.query.player);

        res.json(process_potion(player));
    } catch (e) {
        console.log(e.stack);
        res.sendStatus(400);
    }

});



app.get('/monsterslain', function(req, res) {

    try {
        var player = JSON.parse(req.query.player);
        var monstertype = req.query.monstertype;

        res.json(process_slain(player, monstertype));

    } catch (e) {
        console.log(e.stack);
        res.sendStatus(400);
    }

})



app.get('/heal', function(req, res) {

    try {
        var player = JSON.parse(req.query.player);
        var potions_requested = JSON.parse(req.query.potionamount)
        var maxhealth = player.maxhp;
        var health = player.hp;
        var potions_until_max = Math.ceil((maxhealth - health) / 100);
        var potions = player.potions

        if (potions_requested > potions) {
            res.sendStatus(400);
        } else if (potions_requested > potions_until_max) {
            res.sendStatus(400);
        } else if (potions_requested <= 0) {
            res.sendStatus(400)
        } else {
            res.json(process_heal(player, potions_requested));
        }
    } catch (e) {
        console.log(e.stack);
        res.sendStatus(400);
    }

})

app.get('/run', function(req, res) {

    try {
        var player = JSON.parse(req.query.player);
    
        res.json(process_run(player));
    } catch (e) {
        console.log(e.stack);
        res.sendStatus(400);
    }

})

app.get('/upgrade', function(req, res) {

    try {
        var player = JSON.parse(req.query.player);
        var upgrading = req.query.upgradeoption;

        res.json(process_upgrade(player, upgrading));
    } catch (e) {
        console.log(e.stack);
        res.sendStatus(400);
    }

})

app.get('/health_bar', function(req, res) {

    try {
        var player = JSON.parse(req.query.player);
        var monster = JSON.parse(req.query.monster);

        res.send(process_health_bar(player, monster));
    } catch (e) {
        console.log(e.stack);
        res.sendStatus(400);
    }

})

app.get('/stats_bar', function(req, res) {

    try {
        var player = JSON.parse(req.query.player);

        res.send(process_stats_bar(player));
    } catch (e) {

        console.log(e.stack);
        res.sendStatus(400);
    }

});

app.get('/potionsavailable', function(req, res) {

    try {
        var player = JSON.parse(req.query.player);

        res.send(check_potions(player));
    } catch (e) {
        res.sendStatus(400);
    }

})

app.get('/buypotion', function(req, res) {

    try {
        var player = JSON.parse(req.query.player);
        var amount = req.query.amount

        res.send(process_buy_potions(player, amount));
    } catch (e) {
        console.log(e.stack);
        res.sendStatus(400);
    }

})

// app.listen(3000);

module.exports = app;
