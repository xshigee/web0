    
# CCMapper(Javascript(node))  

2022/12/26+  
CCMapper:  
All Note Off/All Sound Off を追加した。  
CCViewer を追加した。  

2022/12/25      
初版    
  
## 概要    

CCMapperをJavascript(node)で実装した。    
この機能は、[WIDI Bud Pro]経由でMIDIデータをリアルタイムでCC#2またはCC#11を受信して、CC#を任意のもの(複数)に変更して音源に送信する。   
node.jsは、基本的にクロスプラットフォームになっているので、windows/linux/Macで動作する。  

## 準備
1.Windowsの場合、
仮想MIDIデバイスとして、loopMIDIがインストールされている必要がある。
参照：[loopMIDI](https://www.tobias-erichsen.de/software/loopmidi.html)  

MIDI信号の流れとしては以下のようになる：

```
[wind_controler(re.corder/Elfue etc)]→[WIDI Bud Pro]→(CCMapper)→[loopMIDI]→ [PC音源]
```

2.Macの場合
仮想MIDIデバイスとして、IACドライバを設定する。名前はWindowsに合わせて「loopMIDI」とする。 
参照：[仮想MIDIデバイスの設定 - Macことはじめ](https://xshigee.github.io/web0/md/Mac_beginner.html)  

MIDI信号の流れとしては以下のようになる：

```
[wind_controler(re.corder/Elfue etc)]→(CCMapper)→[loopMIDI(IAC)]→ [PC音源]
```

3.linuxの場合、　　
仮想MIDIデバイスとして、既存の[Midi Through port]を利用する。

MIDI信号の流れとしては以下のようになる：
```
[wind_controler(re.corder/Elfue etc)]→[WIDI Bud Pro]→(CCMapper3)→[Midi Through Port]→ [PC音源]
```

## ライブラリのインストール

linux/windows/Mac共通で  
以下の手順でインストールする：  

```
npm install midi
npm install keypress

```


## CCMapper
CCMapperのプログラムとしては以下を使用する：  

CCMapper.js 
```js

// CCMapper.js

// written by: xshige
// 2022/12/26: All Note Off/All Sound Off added
// 2022/12/25

// related URLs
// https://github.com/justinlatimer/node-midi
// https://www.npmjs.com/package/keypress

// the followings are forked from ofxMidi
// channel voice messages
const MIDI_NOTE_OFF = 0x80;
const MIDI_NOTE_ON  = 0x90;
const MIDI_CONTROL_CHANGE = 0xB0;
const MIDI_PROGRAM_CHANGE = 0xC0;
const MIDI_PITCH_BEND = 0xE0;
const MIDI_AFTERTOUCH = 0xD0; // aka channel pressure
const MIDI_POLY_AFTERTOUCH = 0xA0; // aka key pressure

// system messages
const MIDI_SYSEX  = 0xF0;
const MIDI_TIME_CODE = 0xF1;
const MIDI_SONG_POS_POINTER = 0xF2;
const MIDI_SONG_SELECT = 0xF3;
const MIDI_TUNE_REQUEST = 0xF6;
const MIDI_SYSEX_END = 0xF7;
const MIDI_TIME_CLOCK = 0xF8;
const MIDI_START = 0xFA;
const MIDI_CONTINUE = 0xFB;
const MIDI_STOP = 0xFC;
const MIDI_ACTIVE_SENSING = 0xFE;
const MIDI_SYSTEM_RESET = 0xFF;

// number range defines
// because it's sometimes hard to remember these  ...
const MIDI_MIN_BEND = 0;
const MIDI_MAX_BEND = 16383;

//---------------------------------------

function sleep(ms) {
  var startMs = new Date();
  while (new Date() - startMs < ms);
}

//---------------------------------------
// keypress relate code

var keypress = require('keypress');
 
// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);
// swich RAW mode
process.stdin.setRawMode(true);
process.stdin.resume();

// listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {
  // for debug
  //console.log('got "keypress" ch:', ch);
  //console.log('got "keypress" key:', key);
  if (ch == 'q') process.exit(0); // exit node.js
  if (key.name == 'left') {
    transpose -= 12;
    console.log("trans:",transpose);
    return;
  }
  else if (key.name == 'right') {
    transpose += 12;
    console.log("trans:",transpose);
    return;
  }
  else if (key.name == 'up') {
    transpose += 1;
    console.log("trans:",transpose);
    return;
  }
  else if (key.name == 'down') {
    transpose -=1;
    console.log("trans:",transpose);
    return;
  }
});

//---------------------------------------

const midi = require('midi');

const input = new midi.Input();
const output = new midi.Output();

var curPitch = 0;
var transpose = 0;

// list input port
console.log('Input ports: ' + input.getPortCount());
for (var i = 0; i < input.getPortCount(); ++i) {
    console.log('Port ' + i + ' name: ' + input.getPortName(i));
}
// list output port
console.log('output ports: ' + input.getPortCount());
for (var i = 0; i < output.getPortCount(); ++i) {
    console.log('Port ' + i + ' name: ' + output.getPortName(i));
}

var innum = 1; // open WIDI Bug Pro
input.openPort(innum);
console.log('Opened INOUT: ', input.getPortName(innum));

var outnum = 2; // open loopMIDI
output.openPort(outnum);  
console.log('Opened OUTPUT: ', output.getPortName(outnum));

console.log("type 'q' to quit.");

// test
/*
var intervalID = setInterval(myCallback, 500);
function myCallback()
{
  console.log("message sending test");
  output.sendMessage([MIDI_PITCH_BEND, 128,128]);
  output.sendMessage([MIDI_NOTE_ON,72,127]);
  output.sendMessage([MIDI_CONTROL_CHANGE,2,64]);
  output.sendMessage([MIDI_CONTROL_CHANGE,7,64]);
  sleep(100); 
  output.sendMessage([MIDI_NOTE_OFF,72,0]);
}
*/

input.on('message', function(deltaTime, msg) {
  var status = msg[0]&0xF0;
  var channel = msg[0]&0x0F;
  if (status >= MIDI_SYSEX) return;
  if (status == MIDI_NOTE_ON) {
    console.log('NoteOn: pitch:'+msg[1]+' velocity:'+msg[2]);
    output.sendMessage([msg[0],transpose+msg[1],msg[2]]);
    curPitch = msg[1];
    return;
  }
  else if (status == MIDI_NOTE_OFF) {
    console.log('NoteOff: pitch:'+msg[1]+' velocity:'+msg[2]);
    output.sendMessage([msg[0],transpose+msg[1],msg[2]]);
    return;  
  }
  else if (status == MIDI_CONTROL_CHANGE) console.log('ControlChange: control:'+msg[1]+' value:'+msg[2]);
  else if (status == MIDI_PITCH_BEND) {
    var int14 = msg[2]; // 2nd byte
    int14 <<= 7;
    int14 |= msg[1];
    //console.log('Transferring PitchBend: '+(int14-8191));
    console.log('Transferring PitchBend: '+int14+' ('+(int14-8191)+')');
    output.sendMessage(msg);
    return;
  }
  else 
  // The message is an array of numbers corresponding to the MIDI bytes:
  //   [status, data1, data2]
  // https://www.cs.cf.ac.uk/Dave/Multimedia/node158.html has some helpful
  // information interpreting the messages.
  console.log('m:' + msg + ' d:' + deltaTime);

  if (msg[1] == 11 || msg[1] == 2) {
    output.sendMessage([MIDI_CONTROL_CHANGE+channel,1,msg[2]]);
    output.sendMessage([MIDI_CONTROL_CHANGE+channel,2,msg[2]]);
    output.sendMessage([MIDI_CONTROL_CHANGE+channel,7,msg[2]]);
    output.sendMessage([MIDI_CONTROL_CHANGE+channel,11,msg[2]]);
    output.sendMessage([MIDI_CONTROL_CHANGE+channel,26,msg[2]]);
    output.sendMessage([MIDI_CONTROL_CHANGE+channel,74,msg[2]]);
    // AT(CP)
    output.sendMessage([MIDI_AFTERTOUCH+channel, msg[2]]);
    // AT(PP)
    output.sendMessage([MIDI_POLY_AFTERTOUCH+channel, transpose+curPitch, msg[2]]);
    // patch
    // All Note Off
    if (msg[2] ==  0) output.sendMessage([MIDI_CONTROL_CHANGE+channel,123, 0]);
    // All Sound Off
    if (msg[2] == 0) output.sendMessage([MIDI_CONTROL_CHANGE+channel,120, 0]);
    return;  
  }

});

// Sysex, timing, and active sensing messages are ignored
// by default. To enable these message types, pass false for
// the appropriate type in the function below.
// Order: (Sysex, Timing, Active Sensing)
// For example if you want to receive only MIDI Clock beats
// you should use
// input.ignoreTypes(true, false, true)
input.ignoreTypes(false, false, false);

// ... receive MIDI messages ...

/*
// Close the port when done.
setTimeout(function() {
  input.closePort();
}, 10000);
*/
```

動作環境のよる修正部分：  
以下のinnum,outnumの番号を環境にあわせて変更すること  
```js

var innum = 1; // open WIDI Bug Pro
input.openPort(innum);
console.log('Opened INOUT: ', input.getPortName(innum));

var outnum = 2; // open loopMIDI
output.openPort(outnum);  
console.log('Opened OUTPUT: ', output.getPortName(outnum));

```

CCMapper「node CCMapper.js」を起動したら、次に音源を立ち上げて入力MIDIデバイスをlinuxの場合は「Midi Through port」(windows/Macの場合は「loopMIDI port」)に設定する。

ここで、wind_controlerで吹くと音が出る。
                                                                    
なお、色々な音源で必要と思われるCC#を有効にしているので、以下の音源で、そのまま利用できる。多数のCC#が有効になっているが、特に問題がなければ、そのままで、かまわない。

以下、linuxの場合で紹介しているが、windows/macでも同様にインストールできる。  

1. Surge XT  
[SURGE XT - Free & Open Source Hybrid Synthesizer](https://surge-synthesizer.github.io/)  
[Surge XT User Manual](https://surge-synthesizer.github.io/manual-xt/)  
1. Vital  
[VITAL - Spectral warping wavetable synth](https://vital.audio/)  
[Get Vital](https://vital.audio/#getvital)(フリー版もある)   


## 設定方法
起動時、実装されているCC＃が全て有効になっているので、大体の音源が、ブレスに対応して発音できる。
またトランスポーズのキーがあり、オクターブ単位または半音単位で上下できる。  
有効/無効の切り替えはないが、PitchBendは、Wind_Controlerの出力がそのまま音源に転送される。

```
Transpose:: 
[↑] [↓] +/- semitone
[←] [→] -/+ octave

[q] exit from CCMapper

```

## Surge XT のインストール
deb形式のものをダウンロードしてインストールする。

## vital のインストール
1. deb形式のものは、なぜかインストールできなかったので、zip形式のものをダウンロードして解凍する。
1. ~/bin/vitalのディレクトリを作成する。
1. 解凍した内容を~/bin/vitalのディレクトリのなかにコピーする。
1. 「export PATH=\$PATH:\$HOME/bin/vital」を実行してパスを設定する。
1. .bashrcの最後に「export PATH=\$PATH:\$HOME/bin/vital」を追加する。

実行例：
```
export PATH=$PATH:$HOME/bin/vital
which vital
/home/xxxx/bin/vital/vital
vital
```

## CCViewer

CCViewer.js
```js

// CCViewer.js

// written by: xshige
// 2022/12/26

// related URLs
// https://github.com/justinlatimer/node-midi
// https://www.npmjs.com/package/keypress


//----------------------------------------------------

// https://solarianprogrammer.com/2019/04/08/c-programming-ansi-escape-codes-windows-macos-linux-terminals/
// C Programming - using ANSI escape codes on Windows, macOS and Linux terminals
// ANSI sequence colors
const Colors = Object.freeze({
//enum Colors {
  RESET_COLOR : 0,
  BLACK_TXT : 30,
  RED_TXT : 31,
  GREEN_TXT : 32,
  YELLOW_TXT : 33,
  BLUE_TXT : 34,
  MAGENTA_TXT : 35,
  CYAN_TXT : 36,
  WHITE_TXT : 37,
  
  BLACK_BKG : 40,
  RED_BKG : 41,
  GREEN_BKG : 42,
  YELLOW_BKG : 43,
  BLUE_BKG : 44,
  MAGENTA_BKG : 45,
  CYAN_BKG : 46,
  WHITE_BKG : 47	
 //};
});

// array
const v = [];
v.length = 128;

// keep values
var vCC1 = 0;
var vCC2 = 0;
var vCC7 = 0;
var vCC11 = 0;
var vCC74 = 0;
var vCC26 = 0;
//  AT/PP added
var vAT = 0;
var vPP = 0;
// Velocity added
var vVel = 0;
// Pitch Bend added
var vPB = 0; // int14

//---------------

// string[] for bar graph
for (let n = 0; n < 128; n++)
{
  if (127 == n) {
    let s = '';
    for(let m = 0; m < Math.floor(n/2); m++) s = s +'@';
		v[n] = s;
	} else if ((0 <= n) & (n < 13)) {
    let s = '';
    for(let m = 0; m < Math.floor(n/2); m++) s = s +'0';
		v[n] = s;
	} else if ((13 <= n) & (n < 26)) {
    let s = '';
    for(let m = 0; m < Math.floor(n/2); m++) s = s +'1';
		v[n] = s;
	} else if ((26 <= n) & (n < 39)) {
    let s = '';
    for(let m = 0; m < Math.floor(n/2); m++) s = s +'2';
		v[n] = s;
	} else if ((39 <= n) & (n < 52)) {
    let s = '';
    for(let m = 0; m < Math.floor(n/2); m++) s = s +'3';
		v[n] = s;
	} else if ((52 <= n) & (n < 65)) {
    let s = '';
    for(let m = 0; m < Math.floor(n/2); m++) s = s +'4';
		v[n] = s;
	} else if ((65 <= n) & (n < 78)) {
    let s = '';
    for(let m = 0; m < Math.floor(n/2); m++) s = s +'5';
		v[n] = s;
	} else if ((78 <= n) & (n < 91)) {
    let s = '';
    for(let m = 0; m < Math.floor(n/2); m++) s = s +'6';
		v[n] = s;
	} else if ((91 <= n) & (n < 104)) {
    let s = '';
    for(let m = 0; m < Math.floor(n/2); m++) s = s +'7';
		v[n] = s;
	} else if ((104 <= n) & (n < 117)) {
    let s = '';
    for(let m = 0; m < Math.floor(n/2); m++) s = s +'8';
		v[n] = s;
	} else if ((117 <= n) & (n < 127)) {
    let s = '';
    for(let m = 0; m < Math.floor(n/2); m++) s = s +'a';
		v[n] = s;
	}
}
// debug
//for (let n = 0; n < 128; n++) console.log(v[n]);
//process.exit(0);

//----------------------------------------------------


// the followings are forked from ofxMidi
// channel voice messages
const MIDI_NOTE_OFF = 0x80;
const MIDI_NOTE_ON  = 0x90;
const MIDI_CONTROL_CHANGE = 0xB0;
const MIDI_PROGRAM_CHANGE = 0xC0;
const MIDI_PITCH_BEND = 0xE0;
const MIDI_AFTERTOUCH = 0xD0; // aka channel pressure
const MIDI_POLY_AFTERTOUCH = 0xA0; // aka key pressure

// system messages
const MIDI_SYSEX  = 0xF0;
const MIDI_TIME_CODE = 0xF1;
const MIDI_SONG_POS_POINTER = 0xF2;
const MIDI_SONG_SELECT = 0xF3;
const MIDI_TUNE_REQUEST = 0xF6;
const MIDI_SYSEX_END = 0xF7;
const MIDI_TIME_CLOCK = 0xF8;
const MIDI_START = 0xFA;
const MIDI_CONTINUE = 0xFB;
const MIDI_STOP = 0xFC;
const MIDI_ACTIVE_SENSING = 0xFE;
const MIDI_SYSTEM_RESET = 0xFF;

// number range defines
// because it's sometimes hard to remember these  ...
const MIDI_MIN_BEND = 0;
const MIDI_MAX_BEND = 16383;

//---------------------------------------

function sleep(ms) {
  var startMs = new Date();
  while (new Date() - startMs < ms);
}

//---------------------------------------
// keypress relate code

var keypress = require('keypress');
 
// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);
// swich RAW mode
process.stdin.setRawMode(true);
process.stdin.resume();

// listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {
  // for debug
  //console.log('got "keypress" ch:', ch);
  //console.log('got "keypress" key:', key);
  if (ch == 'q') process.exit(0); // exit node.js
  /*
  if (key.name == 'left') {
    transpose -= 12;
    console.log("trans:",transpose);
    return;
  }
  else if (key.name == 'right') {
    transpose += 12;
    console.log("trans:",transpose);
    return;
  }
  else if (key.name == 'up') {
    transpose += 1;
    console.log("trans:",transpose);
    return;
  }
  else if (key.name == 'down') {
    transpose -=1;
    console.log("trans:",transpose);
    return;
  }
  */
});

//---------------------------------------

const midi = require('midi');

const input = new midi.Input();
const output = new midi.Output();

//var curPitch = 0;
//var transpose = 0;

// list input port
console.log('Input ports: ' + input.getPortCount());
for (var i = 0; i < input.getPortCount(); ++i) {
    console.log('Port ' + i + ' name: ' + input.getPortName(i));
}
// list output port
console.log('output ports: ' + input.getPortCount());
for (var i = 0; i < output.getPortCount(); ++i) {
    console.log('Port ' + i + ' name: ' + output.getPortName(i));
}

var innum = 0; // open loopMIDI
input.openPort(innum);
console.log('Opened INOUT: ', input.getPortName(innum));

/*
var outnum = 0; // open xxxxxx
output.openPort(outnum);  
console.log('Opened OUTPUT: ', output.getPortName(outnum));
*/

console.log("type 'q' to quit.");

// test
/*
var intervalID = setInterval(myCallback, 500);
function myCallback()
{
  console.log("message sending test");
  output.sendMessage([MIDI_PITCH_BEND, 128,128]);
  output.sendMessage([MIDI_NOTE_ON,72,127]);
  output.sendMessage([MIDI_CONTROL_CHANGE,2,64]);
  output.sendMessage([MIDI_CONTROL_CHANGE,7,64]);
  sleep(100); 
  output.sendMessage([MIDI_NOTE_OFF,72,0]);
}
*/
//------------------------------------------------------

var intervalID = setInterval(update, 40);
function update() {
  // colsole clear
  console.log("\x1b[2J");
  console.log("\x1b[%d;1m", Colors.WHITE_TXT); 
  console.log("type 'q' to quit.");
  // set text color
  console.log("\x1b[%d;1m", Colors.YELLOW_TXT);
  console.log("CCViewer:");
 
  console.log("CC1 :%d", vCC1);
  console.log(v[vCC1]);

  console.log("CC2 :%d", vCC2);
  console.log(v[vCC2]);

  console.log("CC7 :%d", vCC7);
  console.log(v[vCC7]);

  console.log("CC11 :%d", vCC11);
  console.log(v[vCC11]);

  console.log("CC74 :%d", vCC74);
  console.log(v[vCC74]);

  console.log("CC26 :%d", vCC26);
  console.log(v[vCC26]);

  console.log("-----------------");

  console.log("AT :%d", vAT);
  console.log(v[vAT]);

  console.log("PP :%d", vPP);
  console.log(v[vPP]);

  console.log("-----------------");

  console.log("Vel :%d", vVel);
  console.log(v[vVel]);

  console.log("-----------------");

  console.log("PB :%d", (vPB-8191));
  console.log(v[Math.floor(127*(vPB)/16382)]);
  
  console.log("=================");

}
//------------------------------------------------------


input.on('message', function(deltaTime, msg) {
  var status = msg[0]&0xF0;
  var channel = msg[0]&0x0F;
  if (status >= MIDI_SYSEX) return;
  if (status == MIDI_NOTE_ON) {
    //console.log('NoteOn: pitch:'+msg[1]+' velocity:'+msg[2]);
    //output.sendMessage([msg[0],transpose+msg[1],msg[2]]);
    //curPitch = msg[1];
    vVel = msg[2];
    return;
  }
  else if (status == MIDI_NOTE_OFF) {
    //console.log('NoteOff: pitch:'+msg[1]+' velocity:'+msg[2]);
    //output.sendMessage([msg[0],transpose+msg[1],msg[2]]);
    vVel = msg[2];
    return;  
  }
  else if (status == MIDI_CONTROL_CHANGE) {
    //console.log('ControlChange: control:'+msg[1]+' value:'+msg[2]);
    switch (msg[1]) {
      case 1:
        vCC1 = msg[2];
        return;
      case 2:
        vCC2 = msg[2];
        return;
      case 7:
        vCC7 = msg[2];
        return;
      case 11:
        vCC11 = msg[2];
        return;
      case 74:
        vCC74 = msg[2];
        return;
      case 26:
        vCC26 = msg[2];
        return;
    }
    return;
  }
  else if (status == MIDI_PITCH_BEND) {
    var int14 = msg[2]; // 2nd byte
    int14 <<= 7;
    int14 |= msg[1];
    //console.log('Transferring PitchBend: '+(int14-8191));
    //console.log('Transferring PitchBend: '+int14+' ('+(int14-8191)+')');
    //output.sendMessage(msg);
    vPB = int14;
    return;
  }
  else if (status == MIDI_AFTERTOUCH) {
    vAT = msg[1];
    return;
  }
  else if (status == MIDI_POLY_AFTERTOUCH) {
    vPP = msg[2];
    return;
  }
  else 
  // The message is an array of numbers corresponding to the MIDI bytes:
  //   [status, data1, data2]
  // https://www.cs.cf.ac.uk/Dave/Multimedia/node158.html has some helpful
  // information interpreting the messages.
  console.log('m:' + msg + ' d:' + deltaTime); // none-supported msg
});

// Sysex, timing, and active sensing messages are ignored
// by default. To enable these message types, pass false for
// the appropriate type in the function below.
// Order: (Sysex, Timing, Active Sensing)
// For example if you want to receive only MIDI Clock beats
// you should use
// input.ignoreTypes(true, false, true)
input.ignoreTypes(false, false, false);

// ... receive MIDI messages ...

/*
// Close the port when done.
setTimeout(function() {
  input.closePort();
}, 10000);
*/
```

以下の部分は環境依存の部分で、入力デバイスが、「loopMIDI」(windows/Mac)か「MIDI Through」(linux)になるようにする必要がある。
```js

var innum = 0; // open loopMIDI
input.openPort(innum);
console.log('Opened INOUT: ', input.getPortName(innum));

```

windowsではコンソール画面のリフレッシュレートを下げる必要があるようなので
以下のように修正する：

```js
//var intervalID = setInterval(update, 40);
var intervalID = setInterval(update, 100); // for windows
function update() {
<省略>
```

## 参考情報                                    
Javascript(node)関連：  
[Node.js® is an open-source, cross-platform JavaScript runtime environment](https://nodejs.org/en/)  
[A node.js wrapper for RtMidi providing MIDI I/O](https://github.com/justinlatimer/node-midi)  
[keypress](https://www.npmjs.com/package/keypress)   

loopMIDI関連：  
[loopMIDI](https://www.tobias-erichsen.de/software/loopmidi.html)  
[loopMIDIでつなぐ](https://webmidiaudio.com/npage501.html)  

WIDI_Bud_Pro関連：  
[WIDI Bud Pro](https://hookup.co.jp/products/cme/widi-bud-pro)  
[WIDI Bud Pro 技術情報](https://hookup.co.jp/support/product/widi-bud-pro)  

PC音源関連：  
[[WS音源探訪02] Vital Free Patch for Windsynth つくってみました](https://note.com/windsynth/n/n247ac73351b8)  
wind_controler向けのパッチがあり役に立つ  
[[WS音源探訪01] Vital](https://note.com/windsynth/n/na3b11d4a4f8e)  
[【無料】VitalAudioのWaveTableシンセVitalの紹介](https://chilloutwithbeats.com/vitalaudio-wavetable-vital-intro/)  
[Macことはじめ/仮想MIDIデバイスの設定,Bluetooth_MIDIデバイスの接続](https://xshigee.github.io/web0/md/Mac_beginner.html)  
[Respiro(VST3)を使ってみる](https://xshigee.github.io/web0/md/Respiro.html)  
[Lyrihorn 2(VST3)を使ってみる](https://xshigee.github.io/web0/md/re.corder_Lyrihorn-2.html)  
[EVI-NER(VST3)を使ってみる](https://xshigee.github.io/web0/md/re.corder_EVI-NER.html)  
[re.corder/Elefueに外部音源(Aria/Windows)を接続する(WIDI_Bud_Pro経由)](https://xshigee.github.io/web0/md/re.corder_Aria.html)  
[EWI5000をソフト音源(IFW)と接続する](https://xshigee.github.io/web0/md/EWI5000_IFW.html)  

re.corder関連：  
[owner’s manual re.corder](http://www.artinoise.com/wp-content/uploads/2021/02/artinoise-recorder-manual-ENG-v10.pdf)  
[re.corder Downloads](https://www.recorderinstruments.com/en/support-downloads/)  
[re.corder Frequently Asked Questions](https://www.recorderinstruments.com/en/frequently-asked-questions/)    

MIDI関連：  
[現時点、最強のBluetooth MIDIかも!?　各種BLE-MIDI機器と自動でペアリングしてくれるWIDI Masterがスゴイ！](https://www.dtmstation.com/archives/32976.html)  
[Midi View](https://hautetechnique.com/midi/midiview/)  

ASIO関連：  
[asio4all - ASIOドライバーのないオーディオインターフェイスをASIO対応にできるソフト](https://forest.watch.impress.co.jp/library/software/asio4all/)

Aria関連：  
[EWI MASTER BOOK CD付教則完全ガイド【改訂版】](https://www.alsoj.net/store/view/ALEWIS1-2.html#.YmNpctpBxPY)のp100-p119の音色の設定方法がある

以上  

[Go to Toplevel](https://xshigee.github.io/web0/)  

