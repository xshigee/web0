    
# CCMapper改良版(openFrameworks)  

2022/11/5+      
初版    
  
## 概要    
「[openFrameworksでCCMapperを実装する](https://xshigee.github.io/web0/md/CCMapper_ofx.html)」の続編として、問題点を解消したCCMaper2をopenFrameworks(windows版)で実装した。  
なお、記事として独立して読めるように前の記事の情報を含めた。

## 改良点
1. draw()を描画専用にした。
1. MIDI受信のイベントハンドラーnewMidiMessage()のなかにMIDI送信の処理を含めた。
1. オーバーヘッドを低減するためにフレームレートを下げた。
1. ソース上のlogOutをtrueにするとバーグラフ表示を止めて、コンソールに受信したMIDI情報を表示するようにした。コンソール画面のテキストはコピーできるので、MIDI情報の解析に役立てることができる。

## 準備

1.以下のwindows用frameworkをダウンロードして解凍する；  

[https://github.com/openframeworks/openFrameworks/releases/download/0.11.2/of_v0.11.2_vs2017_release.zip](https://github.com/openframeworks/openFrameworks/releases/download/0.11.2/of_v0.11.2_vs2017_release.zip)  

今回、解凍したframeworkを以下に置いた：  
C:\\of_v0.11.2_vs2017_release  

2.VisualStudio  

[visual studio setup guide](https://openframeworks.cc/setup/vs/)  

上の説明から以下のurlからダウンロード&インストールする：  

[https://www.visualstudio.com/thank-you-downloading-visual-studio/?sku=Community&rel=16](https://www.visualstudio.com/thank-you-downloading-visual-studio/?sku=Community&rel=16)  

## addOn追加(ofxMidi追加)
今回のプログラムはMIDIを使用するのでaddOnとしてofxMidiを追加する。  

1.以下のurlからダウンロードして解凍する：

[https://github.com/danomatika/ofxMidi/archive/refs/heads/master.zip](https://github.com/danomatika/ofxMidi/archive/refs/heads/master.zip)    

2.解凍後、できたofxMidi-master(ディレクトリ)をofxMidiにリネームして、addonsのなかにコピーする。


## プロジェクト設定
新規プロジェクトをビルドするためには,slnなどが必要であり、または既存プロジェクトのディレクトリを移動した場合は.slnなどの変更が必要となる。

このためにはprojctGeneratorを使用する：  
\# 以下に置いてあるので.exeをクリックする  

C:\\of_v0.11.2_vs2017_release\\projectGenerator\\projectGenerator.exe  

新規プロジェクトの場合：  
1. projectGeneratorを立ち上げる
1. プロジェクトファイル名を決める
1. 保存先は of/apps/myApps にする（任意だが、ここがデフォルト）
1. addonは無し
1. [Generate]をクリックする
1. ここで[Open in IDE ]か[close]するかを選択する。

既にあるプロジェクトの.slnなどを生成する場合  
1. projectGeneratorを立ち上げる。
1. [import]をクリックして.slnを生成したいプロジェクト(ディレクトリ)を指定する。
1. [Update]をクリックすると自動的に.slnなどビルドに必要なファイルが自動生成される。
1. ここで[Open in IDE ]か[close]するかを選択する。

以上で、.slnファイルが出来たらVisualStudioで開く。

あとは通常のVisualStudioの操作でビルドを行い実行する。

## CCMapper2(source code)

以下が今回のソースコードになる。  

以下を入力したら、projectGeneratorで.slnなどを作成しビルドする。

置き場所は任意だが以下においた：

C:\\of_v0.11.2_vs2017_release\\apps\\myApps\\CCMapper2\\src  

src/ofApp.cpp
```cpp
// CCMapper2 for wind controler
// improved version
// by xshige
// on 2022/11/5
//---------------
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

	//ofSetVerticalSync(true);
	ofSetVerticalSync(false);

	// CHANGE frame rate to reduce overhead
	//ofSetFrameRate(15);
	//ofSetFrameRate(8);
	ofSetFrameRate(4);
	
	ofBackground(255, 255, 255);
	//ofSetLogLevel(OF_LOG_VERBOSE);

	// print input ports to console
	midiIn.listInPorts();

	// open port by number (you may need to change this)
	//midiIn.openPort(1);

	midiIn.openPort("WIDI Bud Pro 1");
	//midiIn.openPort("WIDI Bud Pro 2");
	
	//midiIn.openPort("IAC Pure Data In");	// by name
	//midiIn.openVirtualPort("ofxMidiIn Input"); // open a virtual port

	//<------------------------------------------------------------------
	
	// print the available output ports to the console
	midiOut.listOutPorts();

	// connect
	//midiOut.openPort(3); // by number

	midiOut.openPort("loopMIDI Port 1 3"); // by name
	//midiOut.openPort("MidiView 4"); // by name

	/////midiOut.openPort(0); // by number
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
}

//--------------------------------------------------------------
void ofApp::draw() {
	if (logOut) return; // do not disp bar graph if logOut

	for(unsigned int i = 0; i < midiMessages.size(); ++i) {

		ofxMidiMessage &message = midiMessages[i];
		int x = 10;
		int y = i*40 + 40;

		// draw the last recieved message contents to the screen,
		// this doesn't print all the data from every status type
		// but you should get the general idea
		stringstream text;
		text << ofxMidiMessage::getStatusString(message.status);
		while(text.str().length() < 16) { // pad status width
			text << " ";
		}

		ofSetColor(127);
		if(message.status < MIDI_SYSEX) {
			text << "chan: " << message.channel;
			if(message.status == MIDI_NOTE_ON ||
			   message.status == MIDI_NOTE_OFF) {
				text << "\tpitch: " << message.pitch;
				ofDrawRectangle(x + ofGetWidth()*0.2, y + 12,
					ofMap(message.pitch, 0, 127, 0, ofGetWidth()*0.2), 10);
				text << "\tvel: " << message.velocity;
				ofDrawRectangle(x + (ofGetWidth()*0.2 * 2), y + 12,
					ofMap(message.velocity, 0, 127, 0, ofGetWidth()*0.2), 10);
			}
			if(message.status == MIDI_CONTROL_CHANGE) {
				text << "\tctl: " << message.control;
				ofDrawRectangle(x + ofGetWidth()*0.2, y + 12,
					ofMap(message.control, 0, 127, 0, ofGetWidth()*0.2), 10);
				text << "\tval: " << message.value;
				ofDrawRectangle(x + ofGetWidth()*0.2 * 2, y + 12,
					ofMap(message.value, 0, 127, 0, ofGetWidth()*0.2), 10);
			}
			else if(message.status == MIDI_PROGRAM_CHANGE) {
				text << "\tpgm: " << message.value;
				ofDrawRectangle(x + ofGetWidth()*0.2, y + 12,
					ofMap(message.value, 0, 127, 0, ofGetWidth()*0.2), 10);
			}
			else if(message.status == MIDI_PITCH_BEND) {
				text << "\tval: " << message.value;
				ofDrawRectangle(x + ofGetWidth()*0.2, y + 12,
					ofMap(message.value, 0, MIDI_MAX_BEND, 0, ofGetWidth()*0.2), 10);
			}
			else if(message.status == MIDI_AFTERTOUCH) {
				text << "\tval: " << message.value;
				ofDrawRectangle(x + ofGetWidth()*0.2, y + 12,
					ofMap(message.value, 0, 127, 0, ofGetWidth()*0.2), 10);
			}
			else if(message.status == MIDI_POLY_AFTERTOUCH) {
				text << "\tpitch: " << message.pitch;
				ofDrawRectangle(x + ofGetWidth()*0.2, y + 12,
					ofMap(message.pitch, 0, 127, 0, ofGetWidth()*0.2), 10);
				text << "\tval: " << message.value;
				ofDrawRectangle(x + ofGetWidth()*0.2 * 2, y + 12,
					ofMap(message.value, 0, 127, 0, ofGetWidth()*0.2), 10);
			}
			text << " "; // pad for delta print
		}
		else {
			text << message.bytes.size() << " bytes ";
		}

		text << "delta: " << message.deltatime;
		ofSetColor(0);
		ofDrawBitmapString(text.str(), x, y);
		text.str(""); // clear
	}
}

//--------------------------------------------------------------
void ofApp::exit() {

	// clean up
	midiIn.closePort();
	midiIn.removeListener(this);
	midiOut.closePort();
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
				midiOut.sendNoteOn(message.channel, message.pitch, message.velocity);
				if (logOut) ofLog(OF_LOG_NOTICE, "channel:%d NoteOn pitch:%3d velocity:%3d", message.channel, message.status, message.pitch, message.velocity);
				return;
			}
			if (message.status == MIDI_NOTE_OFF) {
				midiOut.sendNoteOff(message.channel, message.pitch, message.velocity);
				if (logOut) ofLog(OF_LOG_NOTICE, "channel:%d NoteOFF pitch:%3d velocity:%3d", message.channel, message.status, message.pitch, message.velocity);
				return;
			}

		}
		else if(message.status == MIDI_CONTROL_CHANGE) {
			if (logOut) ofLog(OF_LOG_NOTICE, "channel:%d CC#:%d value:%3d", message.channel, message.control, message.value);
			if (message.control == 2 || message.control == 11) {
				// for Aria
				midiOut.sendControlChange(message.channel, 2, message.value);
				midiOut.sendControlChange(message.channel, 7, message.value);
				midiOut.sendControlChange(message.channel, 26, message.value);
				return;
			}
			else {
				midiOut.sendControlChange(message.channel, message.control, message.value);
				return;
			}
		}
		else if(message.status == MIDI_PROGRAM_CHANGE) {
			if (logOut) ofLog(OF_LOG_NOTICE, "channel:%d PROGRAM_CHANGE value:%3d", message.channel, message.control, message.value);				
			return;
		}
		else if(message.status == MIDI_PITCH_BEND) {
			if (logOut) ofLog(OF_LOG_NOTICE, "channel:%d PITCH_BEND value:%3d", message.channel, message.value);
			return;
		}
		else if(message.status == MIDI_AFTERTOUCH) {
			if (logOut) ofLog(OF_LOG_NOTICE, "channel:%d AT value:%3d", message.channel, message.value);
			return;
		}
		else if(message.status == MIDI_POLY_AFTERTOUCH) {
			if (logOut) ofLog(OF_LOG_NOTICE, "channel:%d POLY_AT pitch:%3d value:%3d", message.channel, message.pitch, message.value);
			return;
		}
	}
	//---------------------------------------------
	//---------------------------------------------
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key) {
	switch(key) {
		case '?':
			midiIn.listInPorts();
			midiOut.listOutPorts();
			break;
	}
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

setup()の中の以下の部分は実行環境に依存しているので  
自分の環境に合わせて変更すること：  

```cpp

	midiIn.openPort("WIDI Bud Pro 1");
	//midiIn.openPort("WIDI Bud Pro 2");
	
...
...
	midiOut.openPort("loopMIDI Port 1 3"); // by name
	//midiOut.openPort("MidiView 4"); // by name

```

src/ofApp,h
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
};
```

src/main.cpp
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
	ofSetupOpenGL(640, 480, OF_WINDOW);
	ofRunApp(new ofApp());
}
```                           

## 実行
VisualStudioから実行するとコンソール画面が現れて以下のような表示になる。

コンソール出力例
```
[notice ] ofxMidiIn: 2 ports available
[notice ] ofxMidiIn: 0: loopMIDI Port 1 0
[notice ] ofxMidiIn: 1: WIDI Bud Pro 1
[notice ] ofxMidiOut: 5 ports available
[notice ] ofxMidiOut: 0: CoolSoft MIDIMapper 0
[notice ] ofxMidiOut: 1: Microsoft GS Wavetable Synth 1
[notice ] ofxMidiOut: 2: VirtualMIDISynth #1 2
[notice ] ofxMidiOut: 3: loopMIDI Port 1 3
[notice ] ofxMidiOut: 4: WIDI Bud Pro 4
```
上のように接続している入力MIDIデバイス、出力MIDIデバイスが表示される。

MIDI接続状況：  
MIDIとしての接続は「[re.corder/ElefueをCCMapper経由で外部音源(Aria/Windows)と接続する(WIDI_Bud_Pro使用)](https://xshigee.github.io/web0/md/CCMapper_Aria.html)」と同じ接続にする。

## トラブルシュート
VisualStudioでビルド中に原因不明のエラーが出たことがあったが
プロジェクトのディレクトリのなかの.vs、xxxx.slnなどを削除したあと
projectGeneraterのimportで再度.slnなどを作成し直すとエラーが解消した。  

## 関連情報  
CCMapper関連：  
[processingでCCMapperを実装する](https://xshigee.github.io/web0/md/CCMapper_processing.html)  
[python版CCMapper - re.corder/ElefueをCCMapper経由で外部音源(Aria/Windows)と接続する(WIDI_Bud_Pro使用)](https://xshigee.github.io/web0/md/CCMapper_Aria.html)  

openframework関連：   
[openFrameworksを使用して独自のMIDI生成のリアルタイムビジュアルを作成します。](https://ask.audio/articles/create-your-own-midi-generated-realtime-visuals-with-openframeworks/ja)  
[Novation LauchpadとopenFrameworksを使ってResolumeのVJコントローラを作る : コーディング編](https://artteknika.hatenablog.com/entry/2016/09/30/223230)  
[プロジェクトにアドオンを追加する方法](https://openframeworks.cc/ja/learning/01_basics/how_to_add_addon_to_project/)   
[新規プロジェクトの作成](https://openframeworks.cc/ja/learning/01_basics/create_a_new_project/)  
[Listen to events](https://openframeworks.cc/learning/06_events/event_example_how_to/)  
[変数の値を見る](https://openframeworks.cc/ja/learning/01_basics/how_to_view_value/)  
[ofLog](https://openframeworks.cc/documentation/utils/ofLog/)  
[openFrameworks-コンソール表示する](https://qiita.com/y_UM4/items/99c875a7a32056d006b5)  
[oF：Windowsのopenframeworksでコンソールウインドウを出さない方法](http://wishupon.me/?p=312)  
[openFrameworks-Log vol.1／環境設定と導入](https://barbegenerativediary.com/tutorials/openframeworks-log-1-setup/)  
[openFramewoks – OSC (Open Sound Control) を利用したネットワーク連携](https://yoppa.org/ma2_10/2279.html)  
                                   
pygame.midi関連：  
[PythonでMIDI](https://webmidiaudio.com/npage507.html)  
[pygame.midi](https://runebook.dev/ja/docs/pygame/ref/midi)   

loopMIDI関連：  
[loopMIDI](https://www.tobias-erichsen.de/software/loopmidi.html)  
[loopMIDIでつなぐ](https://webmidiaudio.com/npage501.html)  

WIDI_Bud_Pro関連：  
[WIDI Bud Pro](https://hookup.co.jp/products/cme/widi-bud-pro)  
[WIDI Bud Pro 技術情報](https://hookup.co.jp/support/product/widi-bud-pro)  

PC音源関連：  
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

