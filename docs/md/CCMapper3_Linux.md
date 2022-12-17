    
# CCMapper3 for Linux  

2022/12/18      
初版    
  
## 概要    

「[CCMapper3 for Win/Mac](https://xshigee.github.io/web0/md/CCMapper3_Win_Mac.html)」の記事の続きにあたる記事で、当該の記事のC#ソースコードはLinuxでは動作しないので、Linux用にOpenFrameworks(C++)で、同様の機能を実装した。
この機能は、[WIDI Bud Pro]経由でMIDIデータをリアルタイムでCC#2またはCC#11を受信して、CC#を任意のもの(複数)に変更して音源に送信する。

## 準備
linuxの場合、仮想MIDIデバイスとして、既存の[Midi Through port]を利用する。

MIDI信号の流れとしては以下のようになる：
```
[wind_controler(re.corder/Elfue etc)]→[WIDI Bud Pro]→(CCMapper3)→[Midi Through Port]→ [PC音源]
```


## CCMapper3
CCMapper3のプログラムとしては以下を使用する：  

CCMapper3/src/ofApp.cpp 
```cpp
// CCMapper3/linux for wind controler
// by xshige
// on 2022/12/14
//---------------

// 2022/12/15
// Pitch Bend transfer

// 2022/12/14 set/rest all
// s set_all
// r reset_all

// 2022/12/12 Transpose
// [+] [-] +/- semitone
// [<] [>] -/+ octave

// 2022/12/12 Keycontrol Support
//-----------------------------
// CC1(MW):
// m toggle

// CC2(Breath Control)
// b toggle

// CC7(Volume)
// v toggle

// CC11(Expression)
// x toggle

// CC74(CutoffFreq):
// c toggle

// CC26(EqGain)
// e toggle

// AT(Channel Pressure):
// a toggle

// PP(Polyphonic Pressure):
// p toggle

// OTHER CC
// o toggle

//---------------------------------

// this program is forked from midiInputExample/midiOutputExample
// by xshige
// on 2022/11/3

/*
 * Copyright (c) 2013 Dan Wilcox <danomatika@gmail.com>
 *
 * BSD Simplified License.
 * For information on usage and redistribution, and for a DISCLAIMER OF ALL
 * WARRANTIES, see the file, "LICENSE.txt," in this distribution.
 *
 * See https://github.com/danomatika/ofxMidi for documentation
 *
 */
#include "ofApp.h"

//--------------------------------------------------------------
void ofApp::setup() {
	logOut = false; // disp text log if true

	ofSetVerticalSync(true);

	// CHANGE frame rate to reduce overhead
	ofSetFrameRate(16);
	
	//ofBackground(255, 255, 255);
	//ofSetLogLevel(OF_LOG_VERBOSE);

	// print input ports to console
	midiIn.listInPorts();

/*
Input Device List
[notice ] ofxMidiIn: 3 ports available
[notice ] ofxMidiIn: 0: Midi Through:Midi Through Port-0 14:0
*[notice ] ofxMidiIn: 1: WIDI Bud Pro:WIDI Bud Pro MIDI 1 20:0
[notice ] ofxMidiIn: 2: ofxMidiOut Client:ofxMidi Output 0 129:0
*/
	// open port by number (you may need to change this)
	midiIn.openPort(1);

	//midiIn.openPort("IAC Pure Data In");	// by name
	//midiIn.openVirtualPort("ofxMidiIn Input"); // open a virtual port

	//<------------------------------------------------------------------
	
	// print the available output ports to the console
	midiOut.listOutPorts();

/*
Output Device List
[notice ] ofxMidiOut: 3 ports available
*[notice ] ofxMidiOut: 0: Midi Through:Midi Through Port-0 14:0
[notice ] ofxMidiOut: 1: WIDI Bud Pro:WIDI Bud Pro MIDI 1 20:0
[notice ] ofxMidiOut: 2: ofxMidiIn Client:ofxMidi Input 1 128:0
*/
	// connect
	midiOut.openPort(0); // by number
	
	//midiOut.openPort("IAC Driver Pure Data In"); // by name
	//midiOut.openVirtualPort("ofxMidiOut"); // open a virtual port

	//>------------------------------------------------------------------

	// don't ignore sysex, timing, & active sense messages,
	// these are ignored by default
	midiIn.ignoreTypes(false, false, false);

	// add ofApp as a listener
	midiIn.addListener(this);

	// print received messages to the console
	//midiIn.setVerbose(true);

}

//--------------------------------------------------------------
void ofApp::update() {
	int key;
	key = getchar();
	switch(key) {
		case '?':
			midiIn.listInPorts();
			midiOut.listOutPorts();
			break;
		case '<':
			transpose -= 12;
			std::printf("trans: %3d\n", transpose);
			break;
		case '>':
			transpose += 12;
			std::printf("trans: %3d\n", transpose);
			break;
		case '+':
			transpose++;
			std::printf("trans: %3d\n", transpose);
			break;
		case '-':
			transpose--;
			std::printf("trans: %3d\n", transpose);
			break;

		case 'm':
			enableCC1 = !enableCC1;
			if (enableCC1) std::printf("MW(CC1) enable\n");
			else std::printf("MW(CC1) disable\n");
			break;
		case 'b':
			enableBC = !enableBC;
			if (enableBC) std::printf("BC(CC2) enable\n");
			else std::printf("BC(CC2) disable\n");
			break;
		case 'v':
			enableVL = !enableVL;
			if (enableVL) std::printf("VL(CC7) enable\n");
			else std::printf("VL(CC7) disable\n");
			break;
		case 'x':
			enableEX = !enableEX;
			if (enableEX) std::printf("EX(CC11) enable\n");
			else std::printf("EX(CC11) disable\n");
			break;
		case 'c':
			enableCC74 = !enableCC74;
			if (enableCC74) std::printf("CC74 enable\n");
			else std::printf("CC74 disable\n");
			break;
		case 'e':
			enableCC26 = !enableCC26;
			if (enableCC26) std::printf("CC26 enable\n");
			else std::printf("CC26 disable\n");
			break;
		case 'a':
			enableAT = !enableAT;
			if (enableAT) std::printf("AT(CP) enable\n");
			else std::printf("AT(CP) disable\n");
			break;
		case 'p':
			enablePP = !enablePP;
			if (enablePP) std::printf("AT(PP) enable\n");
			else std::printf("AT(PP) disable\n");
			break;
		case 'o':
			enableOTHER = !enableOTHER;
			if (enableOTHER) std::printf("OTHER enable\n");
			else std::printf("OTHER disable\n");
			break;
		case 'r':
			// reset all
    		enableCC1 = false; // true will send CC1
    		enableCC74 = false; // CC74
    		enableAT = false; // AT(Channel Pressure)
    		enablePP = false; // AT(Polyphonic Pressure)
    		enableVL = false; // volume
    		enableBC = false;  // breath
    		enableCC26 = false; // EqGain
    		enableEX = false; // Expression
    		enableOTHER = false; // other CC
			std::printf("all reset\n");
			break;
		case 's':
			// set all
    		enableCC1 = true; // true will send CC1
    		enableCC74 = true; // CC74
    		enableAT = true; // AT(Channel Pressure)
    		enablePP = true; // AT(Polyphonic Pressure)
    		enableVL = true; // volume
    		enableBC = true;  // breath
    		enableCC26 = true; // EqGain
    		enableEX = true; // Expression
    		enableOTHER = true; // other CC
			std::printf("all set\n");
			break;
	}
}

//--------------------------------------------------------------
void ofApp::draw() {
}

//--------------------------------------------------------------
void ofApp::exit() {
}

//--------------------------------------------------------------
void ofApp::newMidiMessage(ofxMidiMessage& msg) {

	// add the latest message to the message queue
	midiMessages.push_back(msg);

	// remove any old messages if we have too many
	while (midiMessages.size() > maxMessages) {
		midiMessages.erase(midiMessages.begin());
	}


	//---------------------------------------------
	// one MIDI message will be changed and sent.
    //---------------------------------------------
	
	ofxMidiMessage &message = msg;

	if(message.status < MIDI_SYSEX) {
		if(message.status == MIDI_NOTE_ON || message.status == MIDI_NOTE_OFF) {
			if (message.status == MIDI_NOTE_ON) {
				midiOut.sendNoteOn(message.channel, message.pitch+transpose, message.velocity);
				curPitch = message.pitch;
				if (logOut) ofLog(OF_LOG_NOTICE, "channel:%d NoteOn pitch:%3d velocity:%3d", 
					message.channel, message.pitch, message.velocity);
				return;
			}
			if (message.status == MIDI_NOTE_OFF) {
				midiOut.sendNoteOff(message.channel, message.pitch+transpose, message.velocity);
				if (logOut) ofLog(OF_LOG_NOTICE, "channel:%d NoteOFF pitch:%3d velocity:%3d",
				 	message.channel, message.pitch, message.velocity);
				return;
			}

		}
		else if(message.status == MIDI_CONTROL_CHANGE) {
			if (logOut) ofLog(OF_LOG_NOTICE, "channel:%d CC#:%d value:%3d", message.channel, message.control, message.value);
			if (message.control == 2 || message.control == 11) {
				// for Aria
				if (enableBC) midiOut.sendControlChange(message.channel, 2, message.value);
				if (enableVL) midiOut.sendControlChange(message.channel, 7, message.value);
				if (enableCC26) midiOut.sendControlChange(message.channel, 26, message.value);
				// for other tone generator
				if (enableCC1) midiOut.sendControlChange(message.channel, 1, message.value);
				//midiOut.sendControlChange(message.channel, 5, message.value);  // glide
				if (enableEX) midiOut.sendControlChange(message.channel, 11, message.value);
				if (enableCC74) midiOut.sendControlChange(message.channel, 74, message.value);
				// AT(CP)
				if (enableAT) midiOut.sendAftertouch(message.channel, message.value);
				// AT(PP)
				if (enablePP) midiOut.sendPolyAftertouch(message.channel, curPitch+transpose, message.value);
				return;
			}
			else {
				if (enableOTHER) midiOut.sendControlChange(message.channel, message.control, message.value);
				return;
			}
		}
		else if(message.status == MIDI_PROGRAM_CHANGE) {
			if (logOut) ofLog(OF_LOG_NOTICE, "channel:%d PROGRAM_CHANGE:%3d value:%3d", 
				message.channel, message.control, message.value);				
			return;
		}
		else if(message.status == MIDI_PITCH_BEND) {
			if (logOut) ofLog(OF_LOG_NOTICE, "channel:%d PITCH_BEND value:%3d", 
				message.channel, message.value);

			midiOut.sendPitchBend(message.channel, message.value);
			return;
		}
		else if(message.status == MIDI_AFTERTOUCH) {
			if (logOut) ofLog(OF_LOG_NOTICE, "channel:%d AT value:%3d", 
				message.channel, message.value);
			return;
		}
		else if(message.status == MIDI_POLY_AFTERTOUCH) {
			if (logOut) ofLog(OF_LOG_NOTICE, "channel:%d POLY_AT pitch:%3d value:%3d", 
				message.channel, message.pitch, message.value);
			return;
		}
	}
	//---------------------------------------------
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key) {
}

//--------------------------------------------------------------
void ofApp::keyReleased(int key) {
}

//--------------------------------------------------------------
void ofApp::mouseMoved(int x, int y) {
}

//--------------------------------------------------------------
void ofApp::mouseDragged(int x, int y, int button) {
}

//--------------------------------------------------------------
void ofApp::mousePressed(int x, int y, int button) {
}

//--------------------------------------------------------------
void ofApp::mouseReleased() {
}
```

CCMapper3/src/ofApp.h 
```cpp
/*
 * Copyright (c) 2013 Dan Wilcox <danomatika@gmail.com>
 *
 * BSD Simplified License.
 * For information on usage and redistribution, and for a DISCLAIMER OF ALL
 * WARRANTIES, see the file, "LICENSE.txt," in this distribution.
 *
 * See https://github.com/danomatika/ofxMidi for documentation
 *
 */
#pragma once

#include "ofMain.h"
#include "ofxMidi.h"

class ofApp : public ofBaseApp, public ofxMidiListener {
	
public:
	
	void setup();
	void update();
	void draw();
	void exit();
	
	void keyPressed(int key);
	void keyReleased(int key);
	
	void mouseMoved(int x, int y );
	void mouseDragged(int x, int y, int button);
	void mousePressed(int x, int y, int button);
	void mouseReleased();
	
	void newMidiMessage(ofxMidiMessage& eventArgs);
	
	ofxMidiIn midiIn;
	std::vector<ofxMidiMessage> midiMessages;
	std::size_t maxMessages = 10; //< max number of messages to keep track of  
	
	ofxMidiOut midiOut;
	int channel;
	
	unsigned int currentPgm;
	int note, velocity;
	int pan, bend, touch, polytouch;

	bool logOut;

	int curPitch;

	int transpose = 0;

    bool enableCC1 = true; // true will send CC1
    bool enableCC74 = true; // CC74
    bool enableAT = true; // AT(Channel Pressure)
    bool enablePP = true; // AT(Polyphonic Pressure)
    bool enableVL = true; // volume
    bool enableBC = true;  // breath
    bool enableCC26 = true; // EqGain
    bool enableEX = true; // Expression
    bool enableOTHER = true; // other CC

};
```

CCMapper3/src/main.cpp 
```cpp
/*
 * Copyright (c) 2013 Dan Wilcox <danomatika@gmail.com>
 *
 * BSD Simplified License.
 * For information on usage and redistribution, and for a DISCLAIMER OF ALL
 * WARRANTIES, see the file, "LICENSE.txt," in this distribution.
 *
 * See https://github.com/danomatika/ofxMidi for documentation
 *
 */
#include "ofMain.h"
#include "ofApp.h"

int main(){
	//ofSetupOpenGL(640, 480, OF_WINDOW);
	ofSetupOpenGL(1, 1, OF_WINDOW); // will NOT display OF_Window actually.
									// key event is not effected because OF_Window can NOT be focused  
	ofRunApp(new ofApp());
}
```


CCMapper3を起動したら、次に音源を立ち上げて入力MIDIデバイスを「Midi Through port」に設定する。

ここで、wind_controlerで吹くと音が出る。
                                                                    
なお、色々な音源で必要と思われるCC#を有効にしているので、以下の音源で、そのまま利用できる。多数のCC#が有効になっているが、特に問題がなければ、そのままで、かまわないが、それぞれのCC#をオフする機能がある。

1. Surge XT  
[SURGE XT - Free & Open Source Hybrid Synthesizer](https://surge-synthesizer.github.io/)  
[Surge XT User Manual](https://surge-synthesizer.github.io/manual-xt/)  
1. Vital  
[VITAL - Spectral warping wavetable synth](https://vital.audio/)  
[Get Vital](https://vital.audio/#getvital)(フリー版もある)   


## 設定方法
起動時、実装されているCC＃が全て有効になっているので、大体の音源が、ブレスに対応して発音できる。特に実害がなければ、このままで良いが、キーボードのキーを押すことで該当のCC#(または、AT、PP)を有効/無効にできる。(トグル動作)  
またトランスポーズのキーがあり、オクターブ単位または半音単位で上下できる。  
有効/無効の切り替えはないが、PitchBendは、Wind_Controlerの出力がそのまま音源に転送される。
\# 実装の都合上、入力の際、最後に[Enter]を押す必要がある。
```
CC switches::
CC1(MW): [m] toggle
CC2(Breath Control): [b] toggle
CC7(Volume): [v] toggle
CC11(Expression): [x] toggle
CC74(CutoffFreq): [c] toggle
CC26(EqGain): [e] toggle
AT(Channel Pressure): [a] toggle
PP(Polyphonic Pressure): [p] toggle
OTHER CC: [o] toggle

Transpose:: 
[+] [-] +/- semitone
[<] [>] -/+ octave
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
CC#などの値の状況を表示するプログラムで、特に必須ではないが、値の変化などを確認する際に使用する。

CCViewer/src/ofApp.cpp
```cpp
// CCViewer/linux
// by xshige
// on 2022/12/14
//---------------


//---------------------------------

// this program is forked from midiInputExample/midiOutputExample
// by xshige
// on 2022/11/3

/*
 * Copyright (c) 2013 Dan Wilcox <danomatika@gmail.com>
 *
 * BSD Simplified License.
 * For information on usage and redistribution, and for a DISCLAIMER OF ALL
 * WARRANTIES, see the file, "LICENSE.txt," in this distribution.
 *
 * See https://github.com/danomatika/ofxMidi for documentation
 *
 */
#include "ofApp.h"

//--------------------------------------------------------------
void ofApp::setup() {
	logOut = false; // disp text log if true

	ofSetVerticalSync(true);

	// CHANGE frame rate to reduce overhead
	ofSetFrameRate(4); // ** IMPORTANT MOTE: High rate make noise in Tone Gen.! **
	
	//ofBackground(255, 255, 255);
	//ofSetLogLevel(OF_LOG_VERBOSE);

	// print input ports to console
	midiIn.listInPorts();

/*
Input Device List
[notice ] ofxMidiIn: 3 ports available
*[notice ] ofxMidiIn: 0: Midi Through:Midi Through Port-0 14:0
[notice ] ofxMidiIn: 1: WIDI Bud Pro:WIDI Bud Pro MIDI 1 20:0
[notice ] ofxMidiIn: 2: ofxMidiOut Client:ofxMidi Output 0 129:0
*/
	// open port by number (you may need to change this)
	midiIn.openPort(0);

	//midiIn.openPort("IAC Pure Data In");	// by name
	//midiIn.openVirtualPort("ofxMidiIn Input"); // open a virtual port

	//<------------------------------------------------------------------
	
	// print the available output ports to the console
	midiOut.listOutPorts();

/*
Output Device List
[notice ] ofxMidiOut: 3 ports available
*[notice ] ofxMidiOut: 0: Midi Through:Midi Through Port-0 14:0
[notice ] ofxMidiOut: 1: WIDI Bud Pro:WIDI Bud Pro MIDI 1 20:0
[notice ] ofxMidiOut: 2: ofxMidiIn Client:ofxMidi Input 1 128:0
*/
	// connect
	//// disable midiOut to prevent noise 
	//// midiOut.openPort(0); // by number
	
	//midiOut.openPort("IAC Driver Pure Data In"); // by name
	//midiOut.openVirtualPort("ofxMidiOut"); // open a virtual port

	//>------------------------------------------------------------------

	// don't ignore sysex, timing, & active sense messages,
	// these are ignored by default
	midiIn.ignoreTypes(false, false, false);

	// add ofApp as a listener
	midiIn.addListener(this);

	// print received messages to the console
	//midiIn.setVerbose(true);

//---------------------------------------

            // string[] for bar graph
            for (int n = 0; n < 128; n++)
            {
                if (127 == n) {
					std::string xxx((int)(n / 2), '@'); 
					v[n]=xxx;
				
				} else if ((0 <= n) & (n < 13)) {
					std::string xxx((int)(n / 2), '0'); 
					v[n]=xxx;

				} else if ((13 <= n) & (n < 26)) {
					std::string xxx((int)(n / 2), '1'); 
					v[n]=xxx;

				} else if ((26 <= n) & (n < 39)) {
					std::string xxx((int)(n / 2), '2'); 
					v[n]=xxx;

				} else if ((39 <= n) & (n < 52)) {
					std::string xxx((int)(n / 2), '3'); 
					v[n]=xxx;

				} else if ((52 <= n) & (n < 65)) {
					std::string xxx((int)(n / 2), '4'); 
					v[n]=xxx;

				} else if ((65 <= n) & (n < 78)) {
					std::string xxx((int)(n / 2), '5'); 
					v[n]=xxx;

				} else if ((78 <= n) & (n < 91)) {
					std::string xxx((int)(n / 2), '6'); 
					v[n]=xxx;

				} else if ((91 <= n) & (n < 104)) {
					std::string xxx((int)(n / 2), '7'); 
					v[n]=xxx;

				} else if ((104 <= n) & (n < 117)) {
					std::string xxx((int)(n / 2), '8'); 
					v[n]=xxx;

				} else if ((117 <= n) & (n < 127)) {
					std::string xxx((int)(n / 2), 'a'); 
					v[n]=xxx;

				}
	        }
			//for (int n = 0; n < 128; n++) std::cout << v[n] << "\n";

}

//--------------------------------------------------------------
void ofApp::update() {
					// colsole clear
					std::printf("\x1b[2J"); 
					// set text color
					std::printf("\x1b[%d;1m", YELLOW_TXT);

                    std::printf("CC1 :%3d\n", vCC1);
					std::cout << v[vCC1] << "\n";

                    std::printf("CC2 :%3d\n", vCC2);
					std::cout << v[vCC2] << "\n";

                    std::printf("CC7 :%3d\n", vCC7);
					std::cout << v[vCC7] << "\n";

                    std::printf("CC11 :%3d\n", vCC11);
					std::cout << v[vCC11] << "\n";

                    std::printf("CC74 :%3d\n", vCC74);
					std::cout << v[vCC74] << "\n";

                    std::printf("CC25 :%3d\n", vCC26);
					std::cout << v[vCC26] << "\n";

                    std::printf("-----------------\n");

                    std::printf("AT :%3d\n", vAT);
					std::cout << v[vAT] << "\n";

                    std::printf("PP :%3d\n", vPP);
					std::cout << v[vPP] << "\n";

                    std::printf("-----------------\n");

                    std::printf("Vel :%3d\n", vVel);
					std::cout << v[vVel] << "\n";

                    std::printf("PB :%3d\n", (vPB-8191));
					std::cout << v[(int)(127*(vPB-1)/16382)] << "\n";

                    std::printf("=================\n");

}

//--------------------------------------------------------------
void ofApp::draw() {
}

//--------------------------------------------------------------
void ofApp::exit() {
}

//--------------------------------------------------------------
void ofApp::newMidiMessage(ofxMidiMessage& msg) {

	// add the latest message to the message queue
	midiMessages.push_back(msg);

	// remove any old messages if we have too many
	while (midiMessages.size() > maxMessages) {
		midiMessages.erase(midiMessages.begin());
	}


	//---------------------------------------------
	// one MIDI message will be changed and sent.
    //---------------------------------------------
	
	ofxMidiMessage &message = msg;

	if(message.status < MIDI_SYSEX) {
		if(message.status == MIDI_NOTE_ON || message.status == MIDI_NOTE_OFF) {
			if (message.status == MIDI_NOTE_ON) {
				midiOut.sendNoteOn(message.channel, message.pitch+transpose, message.velocity);
				curPitch = message.pitch;
				if (logOut) ofLog(OF_LOG_NOTICE, "channel:%d NoteOn pitch:%3d velocity:%3d", 
					message.channel, message.pitch, message.velocity);

				vVel = message.velocity;
				return;
			}
			if (message.status == MIDI_NOTE_OFF) {
				midiOut.sendNoteOff(message.channel, message.pitch+transpose, message.velocity);
				if (logOut) ofLog(OF_LOG_NOTICE, "channel:%d NoteOFF pitch:%3d velocity:%3d",
				 	message.channel, message.pitch, message.velocity);

				/*
               	// patch clear on NoteOff
                vCC1 = 0;
                vCC2 = 0;
                vCC7 = 0;
                vCC11 = 0;
                vCC74 = 0;
                vCC26 = 0;
                vAT = 0;
                vPP = 0;
                vVel = 0;
				*/

				return;
			}

		}
		else if(message.status == MIDI_CONTROL_CHANGE) {
			if (logOut) ofLog(OF_LOG_NOTICE, "channel:%d CC#:%d value:%3d", message.channel, message.control, message.value);
			switch(message.control) {
				case 1:
					vCC1 = message.value;
					break;
				case 2:
					vCC2 = message.value;
					break;
				case 7:
					vCC7 = message.value;
					break;
				case 11:
					vCC11 = message.value;
					break;
				case 74:
					vCC74 = message.value;
					break;
				case 26:
					vCC26 = message.value;
					break;
				//-------------------------
			}
		}
		
		else if(message.status == MIDI_PROGRAM_CHANGE) {
			if (logOut) ofLog(OF_LOG_NOTICE, "channel:%d PROGRAM_CHANGE:%3d value:%3d", 
				message.channel, message.control, message.value);				
			return;
		}
		else if(message.status == MIDI_PITCH_BEND) {
			if (logOut) ofLog(OF_LOG_NOTICE, "channel:%d PITCH_BEND value:%3d", 
				message.channel, message.value);

			vPB = message.value;
			return;
		}
		else if(message.status == MIDI_AFTERTOUCH) {
			if (logOut) ofLog(OF_LOG_NOTICE, "channel:%d AT value:%3d", 
				message.channel, message.value);
	
			vAT = message.value;
			return;
		}
		else if(message.status == MIDI_POLY_AFTERTOUCH) {
			if (logOut) ofLog(OF_LOG_NOTICE, "channel:%d POLY_AT pitch:%3d value:%3d", 
				message.channel, message.pitch, message.value);

			vPP = message.value;
			return;
		}
	}
	//---------------------------------------------
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key) {
}

//--------------------------------------------------------------
void ofApp::keyReleased(int key) {
}

//--------------------------------------------------------------
void ofApp::mouseMoved(int x, int y) {
}

//--------------------------------------------------------------
void ofApp::mouseDragged(int x, int y, int button) {
}

//--------------------------------------------------------------
void ofApp::mousePressed(int x, int y, int button) {
}

//--------------------------------------------------------------
void ofApp::mouseReleased() {
}
```

CCViewer/src/ofApp.h
```cpp

/*
 * Copyright (c) 2013 Dan Wilcox <danomatika@gmail.com>
 *
 * BSD Simplified License.
 * For information on usage and redistribution, and for a DISCLAIMER OF ALL
 * WARRANTIES, see the file, "LICENSE.txt," in this distribution.
 *
 * See https://github.com/danomatika/ofxMidi for documentation
 *
 */
#pragma once

// https://solarianprogrammer.com/2019/04/08/c-programming-ansi-escape-codes-windows-macos-linux-terminals/
// C Programming - using ANSI escape codes on Windows, macOS and Linux terminals
// ANSI sequence colors
enum Colors {
 RESET_COLOR,
 BLACK_TXT = 30,
 RED_TXT,
 GREEN_TXT,
 YELLOW_TXT,
 BLUE_TXT,
 MAGENTA_TXT,
 CYAN_TXT,
 WHITE_TXT,
 
 BLACK_BKG = 40,
 RED_BKG,
 GREEN_BKG,
 YELLOW_BKG,
 BLUE_BKG,
 MAGENTA_BKG,
 CYAN_BKG,
 WHITE_BKG	
};

#include "ofMain.h"
#include "ofxMidi.h"

class ofApp : public ofBaseApp, public ofxMidiListener {

public:
	
	void setup();
	void update();
	void draw();
	void exit();
	
	void keyPressed(int key);
	void keyReleased(int key);
	
	void mouseMoved(int x, int y );
	void mouseDragged(int x, int y, int button);
	void mousePressed(int x, int y, int button);
	void mouseReleased();
	
	void newMidiMessage(ofxMidiMessage& eventArgs);
	
	ofxMidiIn midiIn;
	std::vector<ofxMidiMessage> midiMessages;
	std::size_t maxMessages = 10; //< max number of messages to keep track of  
	
	ofxMidiOut midiOut;
	int channel;
	
	unsigned int currentPgm;
	int note, velocity;
	int pan, bend, touch, polytouch;

	bool logOut;

	int curPitch;

	int transpose = 0;

/**
    bool enableCC1 = true; // true will send CC1
    bool enableCC74 = true; // CC74
    bool enableAT = true; // AT(Channel Pressure)
    bool enablePP = true; // AT(Polyphonic Pressure)
    bool enableVL = true; // volume
    bool enableBC = true;  // breath
    bool enableCC26 = true; // EqGain
    bool enableEX = true; // Expression
    bool enableOTHER = true; // other CC
*/

	string v[128];

    // keep values
    int vCC1 = 0;
    int vCC2 = 0;
    int vCC7 = 0;
    int vCC11 = 0;
    int vCC74 = 0;
    int vCC26 = 0;
    //  AT/PP added
    int vAT = 0;
    int vPP = 0;
    // Velocity added
    int vVel = 0;
	// Pitch Bend added
    int vPB = 0;
};
```

CCViewer/src/main.cpp
```cpp

/*
 * Copyright (c) 2013 Dan Wilcox <danomatika@gmail.com>
 *
 * BSD Simplified License.
 * For information on usage and redistribution, and for a DISCLAIMER OF ALL
 * WARRANTIES, see the file, "LICENSE.txt," in this distribution.
 *
 * See https://github.com/danomatika/ofxMidi for documentation
 *
 */
#include "ofMain.h"
#include "ofApp.h"

int main(){
	//ofSetupOpenGL(640, 480, OF_WINDOW);
	ofSetupOpenGL(1, 1, OF_WINDOW); // will NOT display OF_Window actually.
									// key event is not effected because OF_Window can NOT be focused  
	ofRunApp(new ofApp());
}
```


## 参考情報                                    
C++ビルド方法(参考)：  
[linux版openFrameworksを使う](https://xshigee.github.io/web0/md/ofx_linux.html)  

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

