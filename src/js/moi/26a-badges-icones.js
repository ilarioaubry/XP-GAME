// Badges 
(function(){
'use strict';
var OL='#24182c';
/* ---------- shared icon palette (lower = base, UPPER = shade) ---------- */
var PAL={
  o:OL,
  w:'#fbf7ee',W:'#cdc4d6',
  k:'#3c3450',K:'#2a2238',
  j:'#9a9ab4',J:'#68688a',
  m:'#c8d0da',M:'#8a94a8',n:'#f4f8fa',
  g:'#f2c040',G:'#b87f1c',h:'#fff1a8',
  y:'#ffd84a',Y:'#e09a1a',
  a:'#ff9a2a',A:'#cf5e1a',
  r:'#e8433a',R:'#a8262e',q:'#ff9e8e',Q:'#e07a6a',
  p:'#ff7eb0',P:'#d04a86',
  e:'#5ac44a',E:'#2f8a3a',f:'#b0ee7a',
  u:'#4a8ef0',U:'#2c58b8',i:'#b4e0ff',
  c:'#4cd0e8',C:'#1890b0',
  v:'#a066e8',V:'#6a3ab0',
  l:'#c98a4a',L:'#8e5a2a',
  b:'#6e4220',B:'#4a2a16',
  t:'#f0dcae',T:'#c8a874',
  s:'#f6c79c',S:'#d8936a',
  d:'#5a3a8a',D:'#3c2766'
};
var SH={w:'W',k:'K',j:'J',m:'M',g:'G',y:'Y',a:'A',r:'R',p:'P',e:'E',u:'U',c:'C',v:'V',l:'L',b:'B',t:'T',s:'S',d:'D'};

/* ---------- little shape helpers for icon definitions ---------- */
function grid(w,h){var g=[];for(var y=0;y<h;y++){g.push(new Array(w+1).join('.').split(''));}return g;}
function toRows(g){return g.map(function(r){return r.join('');});}
function disc(g,cx,cy,r,ch){for(var y=0;y<g.length;y++)for(var x=0;x<g[0].length;x++){var dx=x-cx,dy=y-cy;if(dx*dx+dy*dy<=r*r)g[y][x]=ch;}}
function put(g,x0,y0,rows){rows.forEach(function(row,y){for(var x=0;x<row.length;x++){var c=row[x];if(c!=='.'&&g[y0+y]&&g[y0+y][x0+x]!==undefined)g[y0+y][x0+x]=c;}});}
function line(g,x0,y0,x1,y1,ch){var n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0));for(var i=0;i<=n;i++){var x=Math.round(x0+(x1-x0)*i/n),y=Math.round(y0+(y1-y0)*i/n);if(g[y]&&g[y][x]!==undefined)g[y][x]=ch;}}
function recol(rows,map){return rows.map(function(r){return r.replace(/./g,function(c){return map[c]!==undefined?map[c]:c;});});}
function mirror(rows){return rows.map(function(r){return r.split('').reverse().join('');});}

/* reusable sprites */
var HEART9=[".rrr.rrr.","rqrrrrrrr","rqrrrrrrr","rrrrrrrrr",".rrrrrrr.","..rrrrr..","...rrr...","....r...."];

var STAR7=["...y...","..yyy..","yyyyyyy",".yyyyy.","..yyy..",".yy.yy.",".y...y."];
var SPARK=[".h.","hwh",".h."];
var SLIME7=["...e...","..eee..",".eeeee.","ewoewoe","eeeeeee",".eeeee."];
var BUST=[".bbb.","bbbbb","bsssb",".sos.","..s..",".uuu.","uuuuu","uuuuu"];
var BUST2=[".bbb.","bbbbb","bosob",".sss.",".uuu.","uuuuu","uuuuu"];

/* ---------- ICONS: content <= 14x14, auto-outlined, centred ---------- */
var IC={
/* ---- Progression ---- */
rank3:{r:[ // wooden training sword
"...l...",
"..tlL..",
"..tlL..",
"..tlL..",
"..tlL..",
"..tlL..",
"..tlL..",
"..tlL..",
"..tlL..",
"bbbbbbb",
"...B...",
"...B...",
"...B...",
"..lll.."]},
rank8:{r:[ // round guard shield
"....mmmmm....",
"..mmlllllmm..",
".mllLlllLllm.",
".mllLlllLllm.",
"mlllLlllLlllm",
"mlllLmmmLlllm",
"mlllLmnmLlllm",
"mlllLmmMLlllm",
"mlllLlllLlllm",
".mllLlllLllm.",
".mllLlllLllm.",
"..mmlllllmm..",
"....mmmmm...."]},
rank12:{r:[ // sword + shield
"..........n...",
".........nmM..",
".........nmM..",
"gggggggg.nmM..",
"grrggrrg.nmM..",
"grrggrRg.nmM..",
"gggggggg.nmM..",
"grrggrRg.nmM..",
"grrggrRg.nmM..",
".grggRg.YYYYY.",
".grggRg...b...",
"..gggg....b...",
"...gg.....b...",
".........YYY.."]},
rank17:{r:[ // laurel wreath + star
"...e.....e...",
"..ef.....fe..",
".eef.....fee.",
".ee...y...ee.",
"eef.yyyyy.fee",
"ee...yyy...ee",
"eef..y.y..fee",
".ee.......ee.",
".eef.....fee.",
"..eee...eee..",
"...eegggee...",
"....rgygr....",
"...rr...rr..."]},
rank23:{r:[ // crown
".h....h....h.",
"ggg..ggg..ggg",
".g...ggg...g.",
".gg..ggg..gg.",
".ggggggggggg.",
".ggggggggggg.",
".ggrgguggrgg.",
".ggggggggggg.",
".GGGGGGGGGGG."]},
rank30:{r:[ // dragon head (profile)
"...........tt.",
"..........tt..",
".........tt...",
".....rrrrrrr..",
"...rrrrrrrrrr.",
"..rrrrroyrrrrr",
".rrrrrrrrrrrrr",
"rorrrrrrrrrrrr",
"rrrrrrrrrrrrr.",
".wwwwRRRRrrrrr",
"......w.wrrrr.",
".rrrrrrrrrrrrr",
"..qqqqqqrrrrr.",
".........rrrr."]},
first:{r:[ // flag with "1"
".g..........",
".brrrrrrr...",
".brrrrwrrrrr",
".brrrwwrrrrr",
".brrrrwrrrrr",
".brrrrwrrrrr",
".brrrwwwrrrr",
".brrrrrrrr..",
".b..........",
".b..........",
".b..........",
".b..........",
"eeee........"]},
stat5sport:{r:[ // dumbbell
"..jj......jj..",
".jjjj....jjjj.",
".jjjj....jjjj.",
"mjjjjmmmmjjjjm",
"MjjjjMMMMjjjjM",
".jjjj....jjjj.",
".jjjj....jjjj.",
"..JJ......JJ.."],sh:0},
stat5perso:{r:[ // painter palette
"...ttttttt...",
"..ttrrtttuut.",
".tttrrtttuutt",
"ttttttttttttt",
"tyyttt.tttee.",
"tyytt...tteet",
"tttttt.tttttt",
"ttvvtttttttt.",
".tvvttttttt..",
"..ttttttt....",
"....ttt......"]},
stat5social:{r:[ // two speech bubbles
".wwwwwww......",
"wwwwwwwww.....",
"wwkwkwkww.....",
"wwwwwwwww.....",
"wwwwwwooo.....",
".wwwwoccccccc.",
".ww..ccccccccc",
".w...cccrcrccc",
".....cccrrrccc",
"......cccrccc.",
"...........cc.",
"............c."]},
stat5famille:{r:[ // house with heart
"......r......",
".....rrr.bb..",
"....rrrrrbb..",
"...rrrrrrrb..",
"..rrrrrrrrr..",
".rrrrrrrrrrr.",
"rrrrrrrrrrrrr",
".ttttttttttt.",
".tttpptppttt.",
".tttpppppttt.",
".ttttppptttt.",
".tttttpttttt.",
".TTTTTTTTTTT."]},
stat5maison:{r:[ // broom
"....l....",
"....l....",
"....l....",
"....l....",
"....l....",
"....l....",
"...rrr...",
"..yyyyy..",
"..yyyyy..",
".yyyyyyy.",
".yYyYyYy.",
"yyYyYyYyy",
"yYyYyYyYy",
"y.y.y.y.y"],sh:0},
stat5soi:{r:[ // lotus
"......p......",
".....ppp.....",
"....ppppp....",
".p..ppPpp..p.",
".pp.ppPpp.pp.",
".pppPpPpPppp.",
"pppppPPPppppp",
".ppppppppppp.",
"..eeeeeeeee..",
".eeEeeeeeEee.",
"..EEE...EEE.."]},
stat5travail:{r:[ // briefcase
"....BBBBB....",
"....B...B....",
".lllllllllll.",
"lllllllllllll",
"lllllllllllll",
"BBBBBgggBBBBB",
"lllllgYglllll",
"lllllllllllll",
"lllllllllllll",
".LLLLLLLLLLL."]},
stat10:{r:[ // mortarboard (master)
"......kk......",
"....kkjjkk....",
"..kkjjjjjjkk..",
"kkjjjjjjjjjjkk",
"..kkjjjggjkkk.",
"....kkkkgggg..",
"...KkkkkkkKg..",
"...kkkkkkkkg..",
"...kkkkkkkkgg.",
"....KKKKKK.gg."],sh:0},
eau3:{r:[ // water drop
"....c....",
"...ccc...",
"...ccc...",
"..ccccc..",
".ccccccc.",
".cwccccc.",
"cwwcccccc",
"cwccccccc",
"ccccccccc",
"cccccccCc",
".ccccCCc.",
"..ccccc.."]},
food3:{r:[ // apple
".....b.....",
".....bee...",
"....beeee..",
"..rrrbrrr..",
".rrrrrrrrr.",
"rrwrrrrrrrr",
"rwrrrrrrrrr",
"rrrrrrrrrrr",
"rrrrrrrrrrr",
".rrrrrrrrr.",
".rrrrrrrrr.",
"..rrr.rrr.."]},
veg7:{r:[ // brocoli
"...eeeee...",
".eefeeeeee.",
"eefeeeeefee",
"efeeeefeeee",
"eeeeeeeeeee",
".eeeeeeeee.",
"..eeffeee..",
"...fffff...",
"....fff....",
"....fff....",
"...fffff..."]},
/* ---- Relations ---- */
bond1:{L:[[HEART9,0,3],[SPARK,9,0]]},
bond3:{L:[[recol(HEART9,{r:'p',q:'w'}),0,0],[HEART9,5,5]]},
bond5:{f:function(){var g=grid(14,13);put(g,1,1,[".rrrr.rrrr.","rrqrrrrrrrr","rqrrrrrrrrr","rrrrrrrrrrr","rrrrrrrrrrr",".rrrrrrrrr.","..rrrrrrr..","...rrrrr...","....rrr....",".....r....."]);
  line(g,0,11,12,1,'l');put(g,10,0,["..w","ww.","w.."]);put(g,11,0,["","..",""]);g[12][0]='w';g[11][1]='l';return toRows(g);} },
bond20:{L:[[["w...........w","ww.........ww","www.......www","wwww.....wwww","wwww.....wwww",".www.....www.","..ww.....ww.."],0,0],[recol(HEART9,{r:'g',q:'h'}),2,3]]},
circle:{f:function(){var g=grid(14,14),cols=['u','r','e','y','v','a'];
  for(var k=0;k<6;k++){var a=-Math.PI/2+k*Math.PI/3,cx=Math.round(5+5*Math.cos(a)),cy=Math.round(5+5*Math.sin(a));
    var c=cols[k];put(g,cx,cy,["."+c+c+".",c+c+c+c,"ssss",".ss."]);}
  put(g,4,6,["rr.rr","rrrrr",".rrr.","..r.."]);return toRows(g);} },
loyal:{r:[
"..m.......m..",
"rrmrrrrrrrmrr",
"rrrrrrrrrrrrr",
"wwwwwwwwwwwww",
"wwwwrrwrrwwww",
"wwwrrrrrrrwww",
"wwwwrrrrrwwww",
"wwwwwrrrwwwww",
"wwwwwwrwwwwww",
"wjwjwjwjwjwjw",
"wwwwwwwwwwwww",
"WWWWWWWWWWWWW"]},
reunion:{r:[
"....rr.rr....",
"....rrrrr....",
".....rrr.....",
"......r......",
".bbb.....yyy.",
"bbbbs...syyyy",
"bbsss...sssyy",
".sos.....sos.",
".sss.....sss.",
".uuuu...pppp.",
"uuuuuu.pppppp",
"uuussssssspp p".replace(' ',''),
"uuuuuu.pppppp",
"uuuuuu.pppppp"]},
grp1:{L:[[recol(BUST2,{u:'e',b:'b'}),0,2],[recol(BUST2,{u:'a',b:'k'}),9,2],[recol(BUST,{b:'y'}),4,0]]},
grptour:{L:[[recol(BUST2,{u:'e',b:'b'}),0,0],[recol(BUST2,{u:'a',b:'k'}),9,0],[recol(BUST2,{b:'y'}),4.5|0,0],
  [[".........ff",
    "........fff",
    ".......fff.",
    "ff....fff..",
    "fff..fff...",
    ".fffffff...",
    "..fffff....",
    "...fff....."],3,6]]},
bday:{r:[
"......a......",
"......y......",
"......u......",
"......u......",
".ppppppppppp.",
".pwppppppppp.",
".lplllplllpl.",
".lllllllllll.",
".rrrrrrrrrrr.",
".lllllllllll.",
".lllllllllll.",
"mmmmmmmmmmmmm",
".MMMMMMMMMMM."]},
/* ---- Exploits ---- */
pu100:{r:[ // centurion helmet
"..rrrrrrrrr..",
".rrrrrrrrrrr.",
".rRrRrRrRrRr.",
"....ggggg....",
"...mmmmmmm...",
"..mnmmmmmmm..",
".mnmmmmmmmmm.",
".mmmmmmmmmmm.",
".ggggggggggg.",
".mmkkkkkkkmm.",
".mmkkkkkkkmm.",
".mmmkkkkkmmm.",
"..mmk...kmm..",
"..mm.....mm.."]},
pu30:{r:[ // flexed bicep with steel bracer
".....ssss....",
"....ssssss...",
"....sSsSss...",
"....ssssss...",
"...mmmm......",
"..mmmm..sss..",
"..sss..sssss.",
".ssss.sssssss",
".sssssssqqsss",
".ssssssqqssss",
"..sssssssssss",
"...SSSSSSSSSS"],sh:1},
pu500:{r:[ // war machine: robot head
"......rr......",
"......mm......",
"..mmmmmmmmmm..",
".mmnmmmmmmmmm.",
"jmnkkkkkkkkmmj",
"jmnkrrkkrrkmmj",
"jmmkkkkkkkkmmj",
".mmmmmmmmmmmm.",
".mmkykykykymm.",
".mmmmmmmmmmmm.",
"..MMMMMMMMMM.."]},
gn120:{r:[ // stopwatch
".....mmm.....",
"......m......",
"....mmmmm....",
"..mmwwwwwmm..",
".mwwwwkwwwwm.",
".mwwwwkwwwwm.",
"mwwwwwkwwwwwm",
"mwwwwwkrrrwwm",
"mwwwwwwwwwwwm",
".mwwwwwwwwwm.",
".mwwwwwwwwwm.",
"..mmwwwwwmm..",
"....mmmmm...."]},
run42:{r:[ // running shoe
".uuuu.........",
".uuuuu........",
".uuuwuw.......",
".uuuuwuw......",
"uuuuuuuwuuu...",
"uuwwuuuuuuuuu.",
"uuuwwwwuuuuuuu",
"wwwwwwwwwwwwww",
"rrr.rrrr.rrrr."]},
zen60:{r:[ // meditating figure
".....bbb.....",
"....bbbbb....",
"....sssss....",
"....sosos....",
".....sss.....",
"......s......",
"...vvvvvvv...",
"..vvvvvvvvv..",
".svvvvvvvvvs.",
"s.vvvvvvvvv.s",
"ss.vvvvvvv.ss",
"uuuuuuuuuuuuu",
".uuuuuuuuuuu."]},
book1:{r:[ // open book
".wwwww..wwwww.",
"wwwwwwWwwwwwww",
"wjjjjwWwjjjjjw",
"wwwwwwWwwwwwww",
"wjjjjwWwjjjjjw",
"wwwwwwWwwwwwww",
"wjjjwwWwjjjwww",
"wwwwwwWwwwwwww",
"uuuuuuUuuuuuuu",
".uuuuu..uuuuu."]},
book5:{L:[
 [["aaaaaaaaw","aayaaaaaw"],2,0],
 [["uuuuuuuuuuw","uuuyuuuuuuw"],1,3],
 [["eeeeeeeeeew","eyeeeeeeeew"],2,6],
 [["rrrrrrrrrrrw","rrryrrrrrrrw"],0,9],
 [["vvvvvvvvvvw","vvvvyvvvvvw"],1,12]]},
bossrev:{f:function(){var g=grid(14,14);
  var S=[
  "...........nm",
  "..........nmM",
  ".........nmM.",
  "........nmM..",
  ".......nmM...",
  "......nmM....",
  "..Y..nmM.....",
  "..YYnmM......",
  "...YYM.......",
  "..bbYY.......",
  ".bb..Y.......",
  "gb...........",
  "g............"];
  put(g,0,0,S);put(g,1,0,mirror(S).map(function(r){return r.replace(/M/g,'m');}));return toRows(g);} ,sh:0},
clean7:{L:[[[
".......eeeee",
".....eeeeeee",
"....eeeeeEee",
"...eeeeeEeee",
"..efeeeEeeee",
"..efeeEeeee.",
".efeeEeeeee.",
".eeeEeeeee..",
".eeEeeeee...",
"..Eeeeee....",
".E.eee......",
"E..........."],2,1],[["..h..",".hwh.","hwwwh",".hwh.","..h.."],0,0]]},
goal7:{f:function(){var g=grid(14,14);var cs=['r','w','r','w','r'];
  for(var i=0;i<5;i++)disc(g,5.5,8,6.4-i*1.35,cs[i]);
  line(g,6,7,12,1,'b');put(g,10,0,["...","..."]);put(g,11,0,["r.r","rr.",".rr"].map(function(r){return r;}));g[0][13]='r';
  put(g,4,8,["k"]);put(g,5,7,["k"]);return toRows(g);} },
bossleg:{r:[ // horned skull with glowing eyes
"t............t",
"tt..........tt",
".tt.wwwwww.tt.",
"..twwwwwwwwt..",
"..wwwwwwwwww..",
".wwwwwwwwwwww.",
".wwoooowooooww".slice(0,14),
".wworowwworoww".slice(0,14),
".wwoooowwoooww",
"..wwwwwoowwww.",
"...wwwwwwwww..",
"...wowowowow..",
"....wwwwwww..."]},
clutch:{r:[ // hourglass
"lllllllllll",
".iiiiiiiii.",
".iyyyyyyyi.",
"..iyyyyyi..",
"...iyyyi...",
"....iyi....",
".....y.....",
"....iyi....",
"...iiyii...",
"..iiyyyii..",
".iyyyyyyyi.",
".iyyyyyyyi.",
"lllllllllll"],sh:0},
lucky3:{r:[ // four-leaf clover
".eee.eee...",
"eefeeefeee.",
"eeeeEeeeee.",
"eeeeEeeeee.",
".eeeEeeee..",
"EEEEEEEEEEE",
".eeeEeeee..",
"eeeeEeeeee.",
"eefeEefeee.",
"eeeee.eeee.",
".eee..E....",
".......E...",
"........E.."].map(function(r){return r;}),sh:0},
secret1:{r:[ // golden key + "?"
".........yyy..",
"........y...y.",
"............y.",
"..........yy..",
".ggg......y...",
"ggggg.........",
"gg.ggggggggggg",
"ggggg....g.gg.",
".ggg.....g..g."]},
rest1:{f:function(){var g=grid(14,14);disc(g,5,8,5.6,'y');disc(g,7.6,6.3,4.6,'.');
  put(g,8,0,["wwww","..w.",".w..","wwww"]);put(g,11,5,["www",".w.","www"]);return toRows(g);} },
/* ---- Skills & défis ---- */
skill1:{r:[ // music note
"...ww...",
"...www..",
"...w.ww.",
"...w..ww",
"...w...w",
"...w....",
"...w....",
"...w....",
".www....",
"wwww....",
"wwww....",
".ww....."]},
skill3:{r:[ // guitar
"...bbb...",
"...bbb...",
"....l....",
"....l....",
"....l....",
"...aaa...",
"..aalaa..",
"..aakaa..",
"..aaaaa..",
".aaaaaaa.",
"aaaaaaaaa",
"aaabbbaaa",
"aaaaaaaaa",
".aaaaaaa."]},
perfect:{f:function(){var g=grid(14,14);
  [[6,0],[6,1],[7,0],[7,1],[6,12],[6,13],[7,12],[7,13],[0,6],[1,6],[0,7],[1,7],[12,6],[13,6],[12,7],[13,7],[2,2],[11,2],[2,11],[11,11]].forEach(function(p){g[p[1]][p[0]]='a';});
  disc(g,6.5,6.5,4.6,'y');
  put(g,4,4,[".....E","....EE","E..EE.","EEEE..",".EE..."]);return toRows(g);} },
chall:{r:[ // trophy
"...ggggggg...",
"gg.ghggggg.gg",
"g..ghggggg..g",
"g..ghggggg..g",
".g.ggggggg.g.",
"..ggggggggg..",
"....ggggg....",
".....ggg.....",
"......g......",
".....ggg.....",
"...bbbbbbb...",
"...bbgggbb...",
"...bbbbbbb..."]},
out1:{f:function(){var g=grid(13,13);disc(g,6,6,6.5,'k');disc(g,6,6,4.8,'K');disc(g,6,6,4.1,'k');disc(g,6,6,2.4,'p');g[6][6]='o';
  g[2][4]='j';g[3][3]='j';g[1][6]='j';g[2][5]='j';return toRows(g);} ,sh:0},
out3:{r:[ // microphone
"..mmmm..",
".mnmmmm.",
".nmMmMm.",
".mmmmmm.",
".mMmMmm.",
"..mmmm..",
".rrrrrr.",
"..kkkk..",
"..kkkk..",
"...kk...",
"...kk...",
"...kk...",
"..kkkk.."],sh:0},
out12:{f:function(){var g=grid(14,14);disc(g,6,7,6.5,'g');disc(g,6,7,4.8,'G');disc(g,6,7,4.1,'g');disc(g,6,7,2.4,'r');g[7][6]='o';
  g[3][4]='h';g[4][3]='h';g[2][6]='h';g[3][5]='h';put(g,11,0,[".h.","hwh",".h."]);put(g,0,11,[".h.","hwh",".h."]);return toRows(g);} ,sh:0},
lz5:{f:function(){var g=grid(14,13);
  put(g,0,0,["......y......","......y......",".....yyy.....","....yyyyy....","yyyyyyyyyyyyy",".yyyyyyyyyyy.","..yyyyyyyyy..","...yyyyyyy...","...yyyyyyy...","..yyyyyyyyy..","..yyyy.yyyy..",".yyy.....yyy.",".y.........y."]);
  put(g,5,3,["ooo","o..","ooo","..o","ooo"]);return toRows(g);} },
lz3x3:{L:[[STAR7,0,6],[recol(STAR7,{y:'m'}),7,6],[recol(STAR7,{y:'a'}),3.5|0,0]]},
/* ---- Régularité ---- */
streak3:{r:[ // small flame
"....a....",
"...aa....",
"...aaa...",
"..aaaa.a.",
"..aayaaa.",
".aaayyaaa",
".aayyyyaa",
"aaayhhyaa",
"aayhhhhya",
"aayhhhhya",
".aayhhyaa",
"..aaaaaa."]},
streak7:{r:[ // big flame
"......a......",
".....aa......",
".....aaa.....",
"....aaaa..a..",
"..a.aaaaa.aa.",
"..aaaayaaaaa.",
".aaaayyaaaaa.",
".aaayyyyaaaaa",
"aaaayyhyyyaaa",
"aaayyhhhyyaaa",
"aaayhhhhhyaaa",
".aayhhhhhyaa.",
"..aayyyyyaa..",
"....aaaaa...."]},
streak30:{r:[ // blazing triple flame
"......r.......",
".....rr.......",
"..r..rar....r.",
".rr..raar..rr.",
".rar.raaar.rar",
"rraarraaarrrar",
"raaarraaaarraa",
"raaaaayaaaaaar",
"raayaayyyaayar",
"raayyyyhyyyyar",
"rayyyhhhhhyyar",
"rraayhhhhhyarr",
".rraayyyyyarr.",
"...rrrrrrrr..."]},
clean7_:null,
sleep7:{r:[ // bed + sleeper
"ll............",
"ll...........",
"ll..........",
"llwwss.......",
"llwwbsuuuuuuu",
"lluuuuuuuuuuu",
"lluuuuuuuuuuul",
"llllllllllllll",
"l............l"]},
mood30:{f:function(){var g=grid(13,13);disc(g,6,6,6.4,'y');
  put(g,3,4,["o...o","o...o"]);put(g,3,4,["o....","o...."]);g[4][8]='o';g[5][8]='o';
  put(g,2,7,["p.......p"]);put(g,3,8,["o.....o",".o...o.","..ooo.."]);g[2][3]='h';g[3][2]='h';return toRows(g);} },
/* ---- Aventure & collection ---- */
buy1:{r:[ // t-shirt
"...rrr.rrr...",
".rrrrrrrrrrr.",
"rrrrrrrrrrrrr",
"rrrrrwwwrrrrr",
".rr.rrrrr.rr.",
"....rrrrr....",
"....rrrrr....",
"....rrrrr....",
"....rrrrr....",
"....RRRRR...."],sh:0},
buy5:{r:[ // hanger with dress
"......mm......",
".....m..m.....",
"........m.....",
".......m......",
"......pp......",
"....mmpPmm....",
"..mm.pppP.mm..",
"mmmm.pppP.mmmm",
"....ppppPP....",
"...ppppppP....",
"..pppppppPP...",
".pppppppppP...",
".PPPPPPPPPPP.."],sh:0},
buy15:{r:[ // wardrobe
".LLLLLLLLLL.",
"llllllllllll",
"lttttllttttl",
"lttttllttttl",
"lttttllttttl",
"ltttgllgtttl",
"lttttllttttl",
"lttttllttttl",
"lttttllttttl",
"llllllllllll",
"ll........ll"]},
boss1:{r:[ // slime
"......e......",
".....eee.....",
"....eeeee....",
"...eefeeee...",
"..eefeeeeee..",
".eeeeeeeeeee.",
".eewoeeewoee.",
"eeewoeeewoeee",
"eeeeeeeeeeeee",
"eeeeerrreeeee",
"eeeeeeeeeeeee",
".eeeeeeeeeee."]},
boss4:{L:[[recol(SLIME7,{e:'v'}),0,1],[recol(SLIME7,{e:'u'}),7,1],[recol(["....e....","...eee...","..eeeee..",".eeeeeee.","eewoeewoe","eewoeewoe","eeeeeeeee","eeerrreee",".eeeeeee."],{e:'r',r:'k'}),2,5]]},
chest1:{r:[ // treasure chest
"..llllllllll..",
".lgllllllllgl.",
"llglllllllllgl".slice(0,14),
"ggggggyygggggg",
"llgllyooylllgl",
"llglllyylllgll",
"llgllllllllgll",
"llgllllllllgll",
"LLgLLLLLLLLgLL"]},
gear4:{r:[ // backpack
"....bbbb....",
"...b....b...",
"..aaaaaaaa..",
".aaaaaaaaaa.",
".aaaaaaaaaa.",
"aaaaaaaaaaaa",
"aAAAAAAAAAAa",
"aaaaaggaaaaa",
"aallllllllaa",
"aallllllllaa",
"aallllllllaa",
"aaaaaaaaaaaa",
".AAAAAAAAAA."]},
legend:{L:[[[
"...vvvvvvv...",
"..vwvvvvvvv..",
".vwvvvvvvvvv.",
"VVVVVVVVVVVVV",
".vvvVvvvVvvv.",
"..vvVvvvVvv..",
"...vVvvvVv...",
"....vVvVv....",
".....vVv.....",
"......v......"],0,2],[SPARK,11,0],[SPARK,0,9]]}
};
delete IC.clean7_;
IC.chest1.r[2]="llgllllllllgll";
IC.chest1.r[4]="llgllyooyllgll";

/* ---------- icon renderer ---------- */
var _icCache={};
function buildIconChars(def){
  var rows;
  if(def.f) rows=def.f();
  else if(def.L){
    var W=0,H=0;def.L.forEach(function(l){H=Math.max(H,l[2]+l[0].length);l[0].forEach(function(r){W=Math.max(W,l[1]+r.length);});});
    var g=grid(W,H);
    def.L.forEach(function(l,li){
      var rr=l[0],ox=l[1],oy=l[2];
      if(li>0){ // stamp an outline around this layer over what is under it
        for(var y=-1;y<=rr.length;y++)for(var x=-1;x<=W;x++){
          var inL=function(xx,yy){return yy>=0&&yy<rr.length&&xx>=0&&xx<(rr[yy]||'').length&&rr[yy][xx]!=='.';};
          if(inL(x,y))continue;
          if(inL(x-1,y)||inL(x+1,y)||inL(x,y-1)||inL(x,y+1)){
            var gy=oy+y,gx=ox+x;if(g[gy]&&g[gy][gx]!==undefined&&g[gy][gx]!=='.')g[gy][gx]='o';}
        }
      }
      put(g,ox,oy,rr);
    });
    rows=toRows(g);
  } else rows=def.r;
  return rows;
}
function iconGrid(id){
  if(_icCache[id])return _icCache[id];
  var def=IC[id];var out=new Array(256).fill(null);
  if(!def){_icCache[id]=out;return out;}
  var rows=buildIconChars(def);
  var x0=99,y0=99,x1=-1,y1=-1;
  rows.forEach(function(r,y){for(var x=0;x<r.length;x++)if(r[x]!=='.'&&r[x]!==' '){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}});
  var w=x1-x0+1,h=y1-y0+1,ox=Math.floor((16-w)/2)-x0,oy=Math.floor((16-h)/2)-y0;
  var ch=new Array(256).fill(null);
  rows.forEach(function(r,y){for(var x=0;x<r.length;x++){var c=r[x];if(c==='.'||c===' ')continue;var X=x+ox,Y=y+oy;if(X>=0&&X<16&&Y>=0&&Y<16)ch[Y*16+X]=c;}});
  var sh=def.sh===undefined?1:def.sh;
  if(sh){ // auto shade: right / bottom edge pixels
    var c2=ch.slice();
    for(var y=0;y<16;y++)for(var x=0;x<16;x++){var c=ch[y*16+x];if(!c||!SH[c])continue;
      var R=x<15?ch[y*16+x+1]:null,B=y<15?ch[(y+1)*16+x]:null;
      if(!R||!B||R==='o'||B==='o')c2[y*16+x]=SH[c];}
    ch=c2;
  }
  for(var i=0;i<256;i++)if(ch[i])out[i]=PAL[ch[i]]||ch[i];
  // outline (4-neighbour)
  var o2=out.slice();
  for(var y=0;y<16;y++)for(var x=0;x<16;x++){if(out[y*16+x])continue;
    if((x>0&&out[y*16+x-1])||(x<15&&out[y*16+x+1])||(y>0&&out[(y-1)*16+x])||(y<15&&out[(y+1)*16+x]))o2[y*16+x]=OL;}
  _icCache[id]=o2;return o2;
}

/* ---------- colours ---------- */
function hx(c){c=c.replace('#','');return [parseInt(c.substr(0,2),16),parseInt(c.substr(2,2),16),parseInt(c.substr(4,2),16)];}
function toHex(a){return '#'+a.map(function(v){v=Math.max(0,Math.min(255,Math.round(v)));return (v<16?'0':'')+v.toString(16);}).join('');}
function mix(a,b,t){a=hx(a);b=hx(b);return toHex([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t]);}
function lum(c){var a=hx(c);return (0.299*a[0]+0.587*a[1]+0.114*a[2])/255;}
var TIER={1:{m:'#b0763c',s:'#7a4b24',l:'#dca068'},2:{m:'#aab4bd',s:'#727c8a',l:'#eef3f5'},3:{m:'#e0b030',s:'#a2701a',l:'#fff0a0'}};
var FILL={
 rank3:'#5b6ee1',rank8:'#5b6ee1',rank12:'#5b6ee1',rank17:'#4d63d6',rank23:'#5a4fd0',rank30:'#6f3fc0',
 first:'#36b679',
 stat5sport:'#e8382f',stat5perso:'#f08300',stat5social:'#00a3a3',stat5famille:'#4a55f5',stat5maison:'#8a4df0',stat5soi:'#1f7fe0',stat5travail:'#6f7f99',stat10:'#b06ad9',
 eau3:'#2c62c8',food3:'#9a5a26',veg7:'#2f8a3a',
 streak3:'#c4502a',streak7:'#a83634',streak30:'#7a2a4a',clean7:'#2f8a9a',goal7:'#4f6ed8',perfect:'#3f9ae0',sleep7:'#5b4fc8',mood30:'#e05a9a',
 bond1:'#ef6aa4',bond3:'#d84a70',bond5:'#b8325a',bond20:'#8e2a5a',circle:'#2fa0a0',loyal:'#7f56d0',reunion:'#e07a3a',grp1:'#3a9a5a',grptour:'#3a72d0',bday:'#5ab0e0',
 pu100:'#b0453a',pu30:'#4f5fb8',pu500:'#6a3f8a',gn120:'#2f8f86',run42:'#e07a2a',zen60:'#7a5ad0',book1:'#3a7ac0',book5:'#8a5a3a',bossrev:'#a83a3a',
 bossleg:'#4a3a6a',clutch:'#5f6fb8',lucky3:'#2f6f8a',secret1:'#5a4a8a',rest1:'#2a3a7a',
 skill1:'#f08300',skill3:'#3a6ab0',chall:'#2f9a5a',out1:'#c2185b',out3:'#9a1a6a',out12:'#6a1a4a',lz5:'#8a4fd0',lz3x3:'#36b679',
 buy1:'#3aa0c0',buy5:'#7a5ac8',buy15:'#3f8a6a',boss1:'#8a2a2a',boss4:'#4a2a5a',chest1:'#3a7a9a',gear4:'#4cc9f0',legend:'#ff9f1a'
};

/* ---------- frame silhouettes ---------- */
var N=32;
function mk(fn){var m=new Array(N*N);for(var y=0;y<N;y++)for(var x=0;x<N;x++)m[y*N+x]=!!fn(x,y);return m;}
var SHAPES={};
function shapes(fam){
  if(SHAPES[fam])return SHAPES[fam];
  var S={base:null,extra:null,under:null,cx:15.5,cy:15.5,io:[8,8],gemY:0};
  if(fam==='prog'){ // heraldic shield
    S.base=mk(function(x,y){if(y<1)return 0;var dx=Math.abs(x-15.5);
      if(y===1)return dx<=12.5;
      if(y<=14)return dx<=13.6;var t=(y-14)/17.6;if(t>=1)return 0;return dx<=14*Math.pow(1-Math.pow(t,1.8),0.6);});
    S.cy=13;S.io=[8,6];S.gemY=0;
  } else if(fam==='reg'){ // round medal with ribbon tails
    S.base=mk(function(x,y){var dx=x-15.5,dy=y-13.5;return dx*dx+dy*dy<=13.7*13.7;});
    S.under=mk(function(x,y){if(y<20)return 0;var t=y-20;
      var l=(x>=7-t*0.25&&x<=13.5-t*0.25),r=(x>=17.5+t*0.25&&x<=24+t*0.25);if(!l&&!r)return 0;
      var mid=l?(10.25-t*0.25):(20.75+t*0.25);if(y>=29&&Math.abs(x-mid)<=(y-28.5))return 0;return 1;});
    S.cy=13.5;S.io=[8,6];S.gemY=-1;
  } else if(fam==='rel'){ // heart
    S.base=mk(function(x,y){var a=(x-9.5)*(x-9.5)+(y-10)*(y-10),b=(x-21.5)*(x-21.5)+(y-10)*(y-10),r2=8.4*8.4;
      if(a<=r2||b<=r2)return 1;if(y<10)return 0;var t=(y-10)/21.2;if(t>=1)return 0;return Math.abs(x-15.5)<=14.4*Math.pow(1-Math.pow(t,1.5),0.75);});
    S.cy=14;S.io=[8,7];S.gemY=4;
  } else if(fam==='exp'){ // star burst
    S.base=mk(function(x,y){var dx=x-15.5,dy=y-15.5;return dx*dx+dy*dy<=12.2*12.2;});
    S.extra=mk(function(x,y){var dx=x-15.5,dy=y-15.5,r=Math.sqrt(dx*dx+dy*dy),a=Math.atan2(dy,dx);
      var k=Math.round(a/(Math.PI/4)),d=Math.abs(a-k*Math.PI/4);var R=12.2+3.9*Math.max(0,1-d/0.25);return r<=R;});
    S.io=[8,8];S.gemY=-1;
  } else if(fam==='skl'){ // gem / diamond
    S.base=mk(function(x,y){var dx=Math.abs(x-15.5),dy=Math.abs(y-15.5);return dx+dy<=17.2&&dx<=15.6&&dy<=15.6;});
    S.io=[8,8];S.gemY=0;
  } else { // col: hanging banner
    S.base=mk(function(x,y){if(x<4||x>27||y<3)return 0;if(y>=25&&Math.abs(x-15.5)<=(y-25)*1.25+0.6)return 0;return 1;});
    S.extra=mk(function(x,y){return (y>=1&&y<=3&&x>=1&&x<=30)||((x<=2||x>=29)&&y>=0&&y<=4);});
    S.cy=14;S.io=[8,6];S.gemY=-1;S.rod=1;
  }
  // chebyshev distance to the outside of base
  var d=new Array(N*N).fill(0),q=[];
  for(var i=0;i<N*N;i++){if(!S.base[i])continue;var x=i%N,y=(i/N)|0,edge=0;
    for(var oy=-1;oy<=1;oy++)for(var ox=-1;ox<=1;ox++){var X=x+ox,Y=y+oy;if(X<0||Y<0||X>=N||Y>=N||!S.base[Y*N+X])edge=1;}
    if(edge){d[i]=1;q.push(i);} }
  for(var qi=0;qi<q.length;qi++){var i=q[qi],x=i%N,y=(i/N)|0;
    for(var oy=-1;oy<=1;oy++)for(var ox=-1;ox<=1;ox++){var X=x+ox,Y=y+oy;if(X<0||Y<0||X>=N||Y>=N)continue;var j=Y*N+X;if(S.base[j]&&!d[j]){d[j]=d[i]+1;q.push(j);}}}
  S.d=d;SHAPES[fam]=S;return S;
}

function famOf(b){return b.fam||'prog';}

window.bdgIcon=function(id){return {W:16,H:16,px:iconGrid(id).slice()};};

window.bdgPx=function(b,locked){
  var fam=famOf(b),S=shapes(fam),t=Math.max(1,Math.min(3,b.t||1));
  var fill=FILL[b.id]||'#5b6ee1',T=TIER[t];
  var C;
  if(!locked){C={ol:OL,inner:OL,rm:T.m,rs:T.s,rl:T.l,f:fill,fs:mix(fill,'#1c1030',0.32),fl:mix(fill,'#ffffff',0.38),
      rib:mix(fill,'#1c1030',0.15),ribS:mix(fill,'#1c1030',0.42),rod:'#a0662e',rodS:'#6e4220',rodL:'#c98a4a'};}
  else C={ol:'#8f8470',inner:'#8f8470',rm:'#b8ac8f',rs:'#a39678',rl:'#d6ccb2',f:'#c9bc9c',fs:'#b5a88a',fl:'#dad0b6',
      rib:'#b8ab8d',ribS:'#a39678',rod:'#b0a487',rodS:'#998d72',rodL:'#c9bc9c'};
  var px=new Array(N*N).fill(null),cx=15.5,cy=S.cy;
  function inU(x,y){if(x<0||y<0||x>=N||y>=N)return false;var i=y*N+x;return S.base[i]||(S.extra&&S.extra[i]);}
  // 1. ribbons behind
  if(S.under){for(var i=0;i<N*N;i++){if(!S.under[i]||S.base[i])continue;var x=i%N,y=(i/N)|0,e=0;
      for(var oy=-1;oy<=1;oy++)for(var ox=-1;ox<=1;ox++){var X=x+ox,Y=y+oy;if(X<0||Y<0||X>=N||Y>=N||(!S.under[Y*N+X]&&!S.base[Y*N+X]))e=1;}
      var mid=x<16?(10.25-(y-20)*0.25):(20.75+(y-20)*0.25);
      px[i]=e?C.ol:(x>mid?C.ribS:C.rib);}}
  // 2. extra rim parts (spikes / rod)
  if(S.extra){for(var i=0;i<N*N;i++){if(!S.extra[i]||S.base[i]&&!S.rod)continue;var x=i%N,y=(i/N)|0,e=0;
      for(var oy=-1;oy<=1;oy++)for(var ox=-1;ox<=1;ox++){if(!inU(x+ox,y+oy))e=1;}
      if(S.rod){ if(e||(y===4&&x>2&&x<29)) {px[i]=C.ol;continue;}
        px[i]=(x<=2||x>=29)?(y<=1?C.rl:(y>=3?C.rs:C.rm)):(y===1?C.rodL:(y===3?C.rodS:C.rod));continue;}
      if(e){px[i]=C.ol;continue;}
      var dot=(x-cx)+(y-cy);px[i]=dot>1?C.rs:(dot<-14?C.rl:C.rm);}}
  // 3. main body: outline / rim / inner line / fill
  var R=fam==='reg'?13.7:14;
  for(var i=0;i<N*N;i++){if(!S.base[i])continue;if(S.rod&&S.extra[i])continue;var x=i%N,y=(i/N)|0,d=S.d[i];
    
    if(d===1){ // true silhouette edge vs junction with extra part
      var e=0;for(var oy=-1;oy<=1;oy++)for(var ox=-1;ox<=1;ox++){if(!inU(x+ox,y+oy))e=1;}
      px[i]=C.ol;continue;}
    if(d===2||d===3){var dot=(x-cx)+(y-cy);
      px[i]=dot>1.5?C.rs:((d===2&&dot<-R*0.55)?C.rl:C.rm);continue;}
    if(d===4){px[i]=C.inner;continue;}
    px[i]=C.f;}
  // fill shading
  var f2=px.slice();
  for(var i=0;i<N*N;i++){if(px[i]!==C.f)continue;var x=i%N,y=(i/N)|0;
    function nf(X,Y){return px[Y*N+X]!==C.f;}
    if(nf(x+1,y)||nf(x,y+1)||nf(x+1,y+1)) f2[i]=C.fs;
    else if((nf(x-1,y)||nf(x,y-1))&&(x-cx)+(y-cy)<-8) f2[i]=C.fl;}
  px=f2;
  // 4. gold tier extra: small gem at top centre
  if(t===3){var gy=S.gemY,gem=locked?{o:C.ol,h:C.rl,r:C.rm,R:C.rs}:{o:OL,h:'#ffd6dc',r:'#e8384f',R:'#a01c3a'};
    if(fam==='reg'||fam==='exp'||fam==='col'){gy={reg:-1,exp:-1,col:-1}[fam];}
    var G=[".oooo.","ohrrRo","orrRRo",".oRRo.","..oo.."];
    if(fam==='col'){G=["oooo","ohRo","oRRo","oooo"];}
    var gx=fam==='col'?14:13,gyy=fam==='prog'?0:fam==='rel'?3:fam==='skl'?0:fam==='col'?0:0;
    if(fam==='reg'||fam==='exp'){gyy=0;}
    for(var y=0;y<G.length;y++)for(var x=0;x<G[y].length;x++){var c=G[y][x];if(c==='.')continue;var X=gx+x,Y=gyy+y;if(Y>=0&&Y<N)px[Y*N+X]=gem[c];}
    if(false){var G2=["oooo","ohRo","oRRo","oooo"];[[0,1],[28,1]].forEach(function(p){for(var y=0;y<4;y++)for(var x=0;x<4;x++){var c=G2[y][x];px[(p[1]+y-1<0?0:p[1]+y-1)*N+p[0]+x]=gem[c];}});}
  }
  // 5. icon
  var ic=iconGrid(b.id),ox=S.io[0],oy=S.io[1];
  for(var y=0;y<16;y++)for(var x=0;x<16;x++){var c=ic[y*16+x];if(!c)continue;
    if(locked)c=lockC(c);
    px[(oy+y)*N+ox+x]=c;}
  return {W:N,H:N,px:px};
};
function lockC(c){if(c===OL)return '#6f6553';var L=lum(c);return L>0.66?'#f1e9d4':L>0.48?'#c9bd9e':L>0.32?'#a89c7f':'#887d66';}
window.bdgIconLocked=function(id){var p=iconGrid(id).map(function(c){if(!c)return c;return lockC(c);});return {W:16,H:16,px:p};};
})();
