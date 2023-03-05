    
# WSL2でOSC受信する  

2023/3/5@        
初版    
  
## 概要    
WSL2でOSC受信を実現した際の設定を記述する。  
結果的に、ポートフォーワードの設定、WSLgインストール、openframeworkインストール、SSHの設定などを記述している。  

## .wslconfig設定
.wslconfigを新規作成か編集で以下の内容にする:  

C:\Users\xxxx\\.wslconfig
```
[wsl2]
localhostForwarding=False
```
設定を有効にするために
以下を実行してWSLを再起動する：
```
wsl.exe --shutdown
```

## VScode remote
VScodeの以下のプラグインをインストールしてWSL2と接続する。  
[https://code.visualstudio.com/docs/remote/remote-overview](https://code.visualstudio.com/docs/remote/remote-overview)  

## SSHサーバーのインストール
WSLで以下を実行してインストールする：  
```
sudo apt install -y openssh-server
sudo ssh-keygen -A
```

## WSLgインストール
windows11のみだったWSLgがwindoss10での動作可能になり
GUIアプリがXサーバー無しで実行可能になった。  
以下を参照してインストールする：  
[Linux 用 Windows サブシステムで Linux GUI アプリを実行する](https://learn.microsoft.com/ja-jp/windows/wsl/tutorials/gui-apps)  
[Windows10のWSL（WSLg）でGUIアプリが動くようになった](https://qiita.com/y-tsutsu/items/6bc65c0ce4d20a82a417)  

肝は、以下にあるように仮想GPUドライバーをインストールすることでWSLgを実現しているようだ。  
```
vGPU 用のインストール済みドライバー

Linux GUI アプリを実行するには、まず以下のシステムに一致するドライバーを
インストールする必要があります。 これにより、仮想 GPU (vGPU) を使用して、
ハードウェア アクセラレータによる OpenGL レンダリングのメリットを享受できます。

WSL 用 Intel GPU ドライバー
WSL 用 AMD GPU ドライバー
WSL 用 NVIDIA GPU ドライバー
```
インストール後の確認として以下を実行すると、  
WSLgのバージョンなどが確認できる：
```
PowerShell 7.3.2
PS C:\Users\xxxx> wsl --version
WSL バージョン: 1.0.3.0
カーネル バージョン: 5.15.79.1
WSLg バージョン: 1.0.47
MSRDC バージョン: 1.2.3575
Direct3D バージョン: 1.606.4
DXCore バージョン: 10.0.25131.1002-220531-1700.rs-onecore-base2-hyp
Windowsバージョン: 10.0.19045.2604
```

## ポートフォワード設定
以下のPowerShellのスクリプトを作成する。  
これは、sshのポート(22)とOSCのポート(8000/9000)などに対応したものである。  

C:\Users\xxxx\wsl_port.ps1
```powershell

if (!([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole("Administrators")) { Start-Process powershell.exe "-File `"$PSCommandPath`"" -Verb RunAs; exit }

$ip = bash.exe -c "ip route |grep 'eth0 proto'|cut -d ' ' -f9"
if( ! $ip ){
  echo "The Script Exited, the ip address of WSL 2 cannot be found";
  exit;
}
echo $ip

# All the ports you want to forward separated by comma
$ports=@(22,8080,8000,9000);
$ports_a = $ports -join ",";

# Remove Firewall Exception Rules
iex "Remove-NetFireWallRule -DisplayName 'WSL 2 Firewall Unlock' ";

# Adding Exception Rules for inbound and outbound Rules
iex "New-NetFireWallRule -DisplayName 'WSL 2 Firewall Unlock' -Direction Outbound -LocalPort $ports_a -Action Allow -Protocol TCP";
iex "New-NetFireWallRule -DisplayName 'WSL 2 Firewall Unlock' -Direction Inbound -LocalPort $ports_a -Action Allow -Protocol TCP";
iex "New-NetFireWallRule -DisplayName 'WSL 2 Firewall Unlock' -Direction Outbound -LocalPort $ports_a -Action Allow -Protocol UDP";
iex "New-NetFireWallRule -DisplayName 'WSL 2 Firewall Unlock' -Direction Inbound -LocalPort $ports_a -Action Allow -Protocol UDP";

for( $i = 0; $i -lt $ports.length; $i++ ){
  $port = $ports[$i];
  iex "netsh interface portproxy add v4tov4 listenport=$port listenaddress=* connectport=$port connectaddress=$ip";
}

# Show proxies
iex "netsh interface portproxy show v4tov4";

WSL --exec sudo service ssh restart
```
このスクリプトをPowerShellで実行することで設定が有効になる。


## SSH接続
上の設定が有効になっているかどうかの確認のためSSH接続してみる。  
PCの外から見えているIP(vEthernet(WSL)のIPでないもの)で
TeraTermなどでSSH接続して接続できればOK.

## openframeworkのOSC受信プログラム
以下のリンクよりopeframeworkをインストールする：  
[download　openFrameworks(linux)](https://github.com/openframeworks/openFrameworks/releases/download/0.11.2/of_v0.11.2_linux64gcc6_release.tar.gz)  
[Linux install](https://openframeworks.cc/setup/linux-install/)  

以下のプログラムを作成する：  
OSC_simpleReceiver/src/main.cpp
```cpp

#include "ofMain.h"
#include "ofApp.h"

int main(){
	// move graphic window to out of display
	ofSetupOpenGL(1920, 1, OF_WINDOW);
	ofSetWindowPosition(0, 0);

	ofRunApp(new ofApp());
}

```

OSC_simpleReceiver/src/ofApp.cpp
```cpp

// OSC simple receiver
// by xshige
// 2023/2/26
//---------------

#include "ofApp.h"

//--------------------------------------------------------------

void ofApp::setup() {

	// listen on the given port
	printf("listening for osc messages on port %d\n", PORT);
	receiver.setup(PORT);

	ofSetVerticalSync(true);

	ofSetFrameRate(16);
}

//--------------------------------------------------------------
void ofApp::update() {

	while( receiver.hasWaitingMessages() )
	{
		// get the next message
		ofxOscMessage m;
		receiver.getNextMessage( &m );
	
		// for TouchOSC
		if (strcmp(m.getAddress().c_str(), "/1/fader1") == 0)
		{
			float f0 = m.getArgAsFloat(0);
			printf("%s %f\n",m.getAddress().c_str(),f0);
		}
		else if (strcmp(m.getAddress().c_str(), "/1/xy") == 0)
		{
			float f0 = m.getArgAsFloat(0);
			float f1 = m.getArgAsFloat(1);
			printf("%s %f %f\n", m.getAddress().c_str(), f0, f1);
		}
		else
		{
			// unrecognized message: display on the bottom of the screen
			char msg_string[16384];
			strcpy( msg_string, m.getAddress().c_str() );
			strcat( msg_string, ": " );

			for ( int i=0; i<m.getNumArgs(); i++ )
			{
				// get the argument type
				strcat( msg_string, m.getArgTypeName( i ).c_str() );
				strcat( msg_string, ":" );
				// display the argument - make sure we get the right type
				if( m.getArgType( i ) == OFXOSC_TYPE_INT32 )
					sprintf( msg_string, "%s%d ", msg_string, m.getArgAsInt32( i ) );
				else if( m.getArgType( i ) == OFXOSC_TYPE_FLOAT )
					sprintf( msg_string, "%s%f ", msg_string, m.getArgAsFloat( i ) );
				else if( m.getArgType( i ) == OFXOSC_TYPE_STRING )
					sprintf( msg_string, "%s\"%s\" ", msg_string, m.getArgAsString( i ) );
				else 
					strcat( msg_string, "unknown" );
			}
			printf("unsupport msg: %s\n",msg_string);
		}
		
	} // while

}


//--------------------------------------------------------------
void ofApp::draw() {
}

//--------------------------------------------------------------
void ofApp::exit() {
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

OSC_simpleReceiver/src/ofApp.h
```cpp

#pragma once

#include "ofMain.h"
#include "ofxMidi.h"
#include "ofxOsc.h"

// listen on port 8000
#define PORT 8000
#define NUM_MSG_STRINGS 20

class ofApp : public ofBaseApp {

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

private:
	ofxOscReceiver	receiver;
	int				current_msg_string;
	std::string		msg_strings[NUM_MSG_STRINGS];
	float			timers[NUM_MSG_STRINGS];

};

```


## UDPフォーワード
「WSL2はUDPフォワードに対応していない?」ようなので以下のpythonスクリプトで対応する。

xferUDP2WSL2.py
```python

# xfer UDP PC ip to WSL2 ip
# 2023/3/4

import socket
import keyboard

# get WSL2 IP
import subprocess
result = subprocess.run('wsl -e hostname -I > wsl2ip.txt', shell=True)
f = open('wsl2ip.txt', 'r', encoding='UTF-8')
wsl2ip = f.read()
wsl2ip = wsl2ip.rstrip()
print("|"+wsl2ip+"|")
f.close()

HOST_NAME = ''
PORT = 8000

HOST2_NAME = wsl2ip # '172.28.113.131'
PORT2 = 8000

sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sock.bind((HOST_NAME, PORT))

sock2 = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

while True:
    # keyboard.read_key() BREAKs transfering (I don't know WHY)
    #if keyboard.read_key() == "q":
    #    print("quit!")
    #    break
    rcv_data, addr = sock.recvfrom(1024)
    print("receive data : [{}]  from {}".format(rcv_data,addr))
    sock2.sendto(rcv_data, (HOST2_NAME, PORT2))
sock.close()
sock2.close()
```

このスクリプトを起動後、
外から見えているIP向けにTouchOSCなどからメッセージを送ると
WSL2側のOSC受信プログラムで受信してメッセージが表示される。  
送信用には上のスクリプトを参考に逆方向の転送スクリプトを作成する必要がある。  


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

