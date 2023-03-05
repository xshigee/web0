    
# WSL2でOSC送信する  

2023/3/6        
初版    
  
## 概要    
本記事は「[WSL2でOSC受信する](https://xshigee.github.io/web0/md/WSL2_OSC_Receive.html)」の続編にあたり、OSC送信について記述する。  
設定などは前記事と全く同じなので省略する。  

## openframeworkのOSC送信プログラム
以下のリンクよりopeframeworkをインストールする：  
[download openFrameworks(linux)](https://github.com/openframeworks/openFrameworks/releases/download/0.11.2/of_v0.11.2_linux64gcc6_release.tar.gz)  
[Linux install](https://openframeworks.cc/setup/linux-install/)  

以下のプログラムを作成する：  
OSC_simpleSender/src/main.cpp
```cpp

#include "ofMain.h"
#include "ofApp.h"

int main() {
	// move graphic window to out of display
	ofSetupOpenGL(1920, 1, OF_WINDOW);
	ofSetWindowPosition(0, 0);

	ofRunApp(new ofApp());
}

```

OSC_simpleSender/src/ofApp.cpp
```cpp

// OSC simple sender
// by xshige
// 2023/3/2
//---------------

#include "ofApp.h"

//--------------------------------------------------------------

void ofApp::setup() {

	// send to the given port
	printf("sender to %s:%d\n", HOST,PORT);
	sender.setup(HOST, PORT);

	ofSetVerticalSync(true);

	ofSetFrameRate(16);
}

//--------------------------------------------------------------
void ofApp::update() {
}


//--------------------------------------------------------------
void ofApp::draw() {
}

//--------------------------------------------------------------
void ofApp::exit() {
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key) {
	if (key == 'f' || key == 'F')
	{
		ofxOscMessage m;
		m.setAddress("/1/fader1");
		m.addFloatArg(0.7f);
		sender.sendMessage(m);
	}
	if (key == 'x' || key == 'X')
	{
		ofxOscMessage m;
		m.setAddress("/1/xy");
		m.addFloatArg(0.5f);
		m.addFloatArg(0.123f);
		sender.sendMessage(m);
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

OSC_simpleSender/src/ofApp.h
```cpp

#pragma once

#define TOTOUCHOSC

#include "ofMain.h"
//#include "ofxMidi.h"
#include "ofxOsc.h"

#ifdef TOTOUCHOSC
// to TouchOSC
#define HOST "192.168.0.7"
#define PORT 9000
#endif

class ofApp : public ofBaseApp {

public:

	void setup();
	void update();
	void draw();
	void exit();

	void keyPressed(int key);
	void keyReleased(int key);

	void mouseMoved(int x, int y);
	void mouseDragged(int x, int y, int button);
	void mousePressed(int x, int y, int button);
	void mouseReleased();

private:
	ofxOscSender sender;

};

```
[f]または[x]のキーを叩くとOSCメッセージが送信される。  
前記事で「送信用には上のスクリプトを参考に逆方向の転送スクリプトを作成する必要がある。」と記述したがUDP転送スクリプトは不要であった。  
ただ単にターゲットになる(送信先の)IPアドレスをプログラムのなかで設定するだけで良い。

## 参考情報           
WSL2関連：  
[Linux 用 Windows サブシステムで Linux GUI アプリを実行する](https://learn.microsoft.com/ja-jp/windows/wsl/tutorials/gui-apps)  
[Windows10のWSL（WSLg）でGUIアプリが動くようになった](https://qiita.com/y-tsutsu/items/6bc65c0ce4d20a82a417)  
[Windows WSL2に外部から直接アクセスするための設定](https://rcmdnk.com/blog/2021/03/01/computer-windows-network/)  
[【メモ】WSL2上のsshサーバに外部から接続する](https://tkyonezu.com/windows10/%E3%80%90%E3%83%A1%E3%83%A2%E3%80%91wsl2%E4%B8%8A%E3%81%AEssh%E3%82%B5%E3%83%BC%E3%83%90%E3%81%AB%E5%A4%96%E9%83%A8%E3%81%8B%E3%82%89%E6%8E%A5%E7%B6%9A%E3%81%99%E3%82%8B/)  

openFrameworks関連：  
[UbuntuでopenFrameworksの開発環境を構築する。](https://qiita.com/nnn112358/items/b6834379e2eeeeae6793)  

TouchOSC関連：  
[TouchOSCMk1](https://hexler.net/touchosc-mk1#get)  
昔からあるTouchOSCで「MK1」付きに改名している  
[Open Sound Control](https://ja.wikipedia.org/wiki/OpenSound_Control)  
[iPhone でスクリーンショットを撮る](https://support.apple.com/ja-jp/HT200289)  

以上  

[Go to Toplevel](https://xshigee.github.io/web0/)  

