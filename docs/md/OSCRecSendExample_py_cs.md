    
# OSC RecSend Example(python3/C#)  

2022/12/23      
初版    
  
## 概要    
OSC受信/送信サンプルについて纏めた。

## Python3
python3でLinux/Windos/Macの場合、
以下をインストールする：

```
pip install python-osc

```

PythonOSCserverRecSend.py         
```python
#!/usr/bin/env python

# PythonOSCserverRecSend.py

# 2022/12/23

import socket
from pythonosc import osc_server
from pythonosc.udp_client import SimpleUDPClient
from pythonosc.dispatcher import Dispatcher

dispatcher = Dispatcher()

host_ip = socket.gethostbyname(socket.gethostname()) # get host IP address
server = osc_server.ThreadingOSCUDPServer((host_ip, 8000), dispatcher)
# IMPORTANT NOTE: "127.0.0.1" does not work. we need real IP address for Host

client = SimpleUDPClient("192.168.1.6", 9000) # target iPhone(TouchOSC)

def adr1f(path, *args):
    print( "received '%s' : '%f'" % (path, args[0]) )
    # send test
    if path == "/1/fader1":
        client.send_message("/1/fader2", args)
        client.send_message("/1/fader5", [args[0]])

def adr2f(path, *args):
    print( "received '%s' : '%f','%f'" % (path, args[0], args[1]) )

def default_handler(path, *args):
    print(f"DEFAULT {path}: {args}")
    print("")

dispatcher.map("/*/fader*", adr1f)
dispatcher.map("/*/xy", adr2f)
dispatcher.map("/*/*", default_handler)

print(f'Serving on {server.server_address}')
server.serve_forever()
```             

以下の部分は、実際に使用する(対向する)iPhoneのIPアドレスを入れる：
```python
client = SimpleUDPClient("192.168.1.6", 9000) # target iPhone(TouchOSC)
```

## C\#          
Visual Studio のインストール  

Windowsの場合  
「[visual studio setup guide](https://openframeworks.cc/setup/vs/)」を参考にしてインストールする。    

Macの場合　　
「[Visual Studio 無償版](https://visualstudio.microsoft.com/ja/free-developer-offers/)」から 「Visual Studio for Mac」をダウンロードしてインストールする。

Linuxの場合  
visual studioが存在しないので替わりに、以下を参照してdotnetをインストールする。  
[dotnetでC#を動かす](https://xshigee.github.io/web0/md/dotnet_Cs.html)  

OSCserverRecSend/Program.cs
```cs
// OSCserverRecSend.cs
// written by: xshige
// 2022/12/22

using Rug.Osc;
using System;
using System.Net;
using System.Text;
//using System.Text.RegularExpressions;
//using System.Net;
using System.Threading;

internal class Program
{
    static OscReceiver receiver;
    static OscSender sender;
    static Thread thread;

    public static string ByteArrayToString(byte[] ba)
    {
        StringBuilder hex = new StringBuilder(ba.Length * 3);
        foreach (byte b in ba)
            hex.AppendFormat("{0:x2}:", b);
        return hex.ToString();
    }
    static void Main(string[] args)
    {
        // This is the port we are going to listen on 
        int port = 8000;
        int outPort = 9000;
        IPAddress sendAddress = IPAddress.Parse("192.168.1.6"); // IP address of iPhone(TouchOSC)

        // Create the receiver
        receiver = new OscReceiver(port);
        // Create the sender
        sender = new OscSender(sendAddress, outPort);

        // Create a thread to do the listening
        thread = new Thread(new ThreadStart(ListenLoop));

        // Connect the receiver
        receiver.Connect();

        // Start the listen thread
        thread.Start();

        // Connect the sender
        sender.Connect();

        // wait for a key press to exit
        Console.WriteLine("Press any key to exit");
        Console.ReadKey(true);

        // close the Reciver 
        receiver.Close();

        // Wait for the listen thread to exit
        thread.Join();
    }

    static void ListenLoop()
    {
        try
        {
            while (receiver.State != OscSocketState.Closed)
            {
                // if we are in a state to recieve
                if (receiver.State == OscSocketState.Connected)
                {
                    // get the next message 
                    // this will block until one arrives or the socket is closed
                    OscPacket packet = receiver.Receive();

                    var arg0 = packet.ToString().Split(',')[0]; // get OSC address

                    // for TouchOSC layout Simple/1 or Mix16/2
                    if (arg0.Equals("/1/fader1") || arg0.Equals("/2/fader1"))
                    {
                        /*
                        // bad method
                        Console.WriteLine(arg0);
                        var arg1 = Regex.Replace(packet.ToString().Split(',')[1], @"[^0-9.]", string.Empty);
                        float f1 = float.Parse(arg1);
                        Console.WriteLine(f1);
                        Console.WriteLine("");
                        */

                        Console.WriteLine(arg0);

                        var ba = packet.ToByteArray();

                        //// for Debug
                        ////Console.WriteLine(ba.Length);
                        ////Console.WriteLine(ByteArrayToString(ba));

                        if (BitConverter.IsLittleEndian) Array.Reverse(ba);
                        ////Console.WriteLine(ByteArrayToString(ba));

                        float f1 = BitConverter.ToSingle(ba, 0);
                        Console.WriteLine(f1);

                        Console.WriteLine("");

                        // send test
                        sender.Send(new OscMessage("/1/fader2", f1));
                        sender.Send(new OscMessage("/1/fader5", f1));
                        sender.Send(new OscMessage("/2/fader2", f1));

                    }
                    else if (arg0.Equals("/1/fader2") || arg0.Equals("/2/fader2"))
                    {
                        Console.WriteLine(arg0);

                        var ba = packet.ToByteArray();

                        if (BitConverter.IsLittleEndian) Array.Reverse(ba);

                        float f1 = BitConverter.ToSingle(ba, 0);
                        Console.WriteLine(f1);

                        Console.WriteLine("");
                    }
                    else if (arg0.Equals("/1/fader3") || arg0.Equals("/2/fader3"))
                    {
                        Console.WriteLine(arg0);

                        var ba = packet.ToByteArray();

                        if (BitConverter.IsLittleEndian) Array.Reverse(ba);

                        float f1 = BitConverter.ToSingle(ba, 0);
                        Console.WriteLine(f1);

                        Console.WriteLine("");
                    }
                    else if (arg0.Equals("/1/fader4") || arg0.Equals("/2/fader4"))
                    {
                        Console.WriteLine(arg0);

                        var ba = packet.ToByteArray();

                        if (BitConverter.IsLittleEndian) Array.Reverse(ba);

                        float f1 = BitConverter.ToSingle(ba, 0);
                        Console.WriteLine(f1);

                        Console.WriteLine("");
                    }
                    else if (arg0.Equals("/1/fader5") || arg0.Equals("/2/fader5"))
                    {

                        Console.WriteLine(arg0);

                        var ba = packet.ToByteArray();

                        if (BitConverter.IsLittleEndian) Array.Reverse(ba);

                        float f1 = BitConverter.ToSingle(ba, 0);
                        Console.WriteLine(f1);

                        Console.WriteLine("");
                    }
                    else if (arg0.Equals("/1/fader6") || arg0.Equals("/2/fader6"))
                    {

                        Console.WriteLine(arg0);

                        var ba = packet.ToByteArray();

                        if (BitConverter.IsLittleEndian) Array.Reverse(ba);

                        float f1 = BitConverter.ToSingle(ba, 0);
                        Console.WriteLine(f1);

                        Console.WriteLine("");
                    }
                    else if (arg0.Equals("/1/fader7") || arg0.Equals("/2/fader7"))
                    {

                        Console.WriteLine(arg0);

                        var ba = packet.ToByteArray();

                        if (BitConverter.IsLittleEndian) Array.Reverse(ba);

                        float f1 = BitConverter.ToSingle(ba, 0);
                        Console.WriteLine(f1);

                        Console.WriteLine("");
                    }
                    else if (arg0.Equals("/1/fader8") || arg0.Equals("/2/fader8"))
                    {

                        Console.WriteLine(arg0);

                        var ba = packet.ToByteArray();

                        if (BitConverter.IsLittleEndian) Array.Reverse(ba);

                        float f1 = BitConverter.ToSingle(ba, 0);
                        Console.WriteLine(f1);

                        Console.WriteLine("");
                    }
                    // toggles
                    else if (arg0.Equals("/1/toggle1") || arg0.Equals("/2/toggle1"))
                    {

                        Console.WriteLine(arg0);

                        var ba = packet.ToByteArray();

                        if (BitConverter.IsLittleEndian) Array.Reverse(ba);

                        float f1 = BitConverter.ToSingle(ba, 0);
                        Console.WriteLine(f1);

                        Console.WriteLine("");
                    }
                    else if (arg0.Equals("/1/toggle2") || arg0.Equals("/2/toggle2"))
                    {

                        Console.WriteLine(arg0);

                        var ba = packet.ToByteArray();

                        if (BitConverter.IsLittleEndian) Array.Reverse(ba);

                        float f1 = BitConverter.ToSingle(ba, 0);
                        Console.WriteLine(f1);

                        Console.WriteLine("");
                    }
                    else if (arg0.Equals("/1/toggle3") || arg0.Equals("/2/toggle3"))
                    {

                        Console.WriteLine(arg0);

                        var ba = packet.ToByteArray();

                        if (BitConverter.IsLittleEndian) Array.Reverse(ba);

                        float f1 = BitConverter.ToSingle(ba, 0);
                        Console.WriteLine(f1);

                        Console.WriteLine("");
                    }
                    else if (arg0.Equals("/1/toggle4") || arg0.Equals("/2/toggle4"))
                    {

                        Console.WriteLine(arg0);

                        var ba = packet.ToByteArray();

                        if (BitConverter.IsLittleEndian) Array.Reverse(ba);

                        float f1 = BitConverter.ToSingle(ba, 0);
                        Console.WriteLine(f1);

                        Console.WriteLine("");
                    }
                    else if (arg0.Equals("/1/toggle5") || arg0.Equals("/2/toggle5"))
                    {

                        Console.WriteLine(arg0);

                        var ba = packet.ToByteArray();

                        if (BitConverter.IsLittleEndian) Array.Reverse(ba);

                        float f1 = BitConverter.ToSingle(ba, 0);
                        Console.WriteLine(f1);

                        Console.WriteLine("");
                    }
                    else if (arg0.Equals("/1/toggle6") || arg0.Equals("/2/toggle6"))
                    {

                        Console.WriteLine(arg0);

                        var ba = packet.ToByteArray();

                        if (BitConverter.IsLittleEndian) Array.Reverse(ba);

                        float f1 = BitConverter.ToSingle(ba, 0);
                        Console.WriteLine(f1);

                        Console.WriteLine("");
                    }
                    else if (arg0.Equals("/1/toggle7") || arg0.Equals("/2/toggle7"))
                    {

                        Console.WriteLine(arg0);

                        var ba = packet.ToByteArray();

                        if (BitConverter.IsLittleEndian) Array.Reverse(ba);

                        float f1 = BitConverter.ToSingle(ba, 0);
                        Console.WriteLine(f1);

                        Console.WriteLine("");
                    }
                    else if (arg0.Equals("/1/toggle8") || arg0.Equals("/2/toggle8"))
                    {

                        Console.WriteLine(arg0);

                        var ba = packet.ToByteArray();

                        if (BitConverter.IsLittleEndian) Array.Reverse(ba);

                        float f1 = BitConverter.ToSingle(ba, 0);
                        Console.WriteLine(f1);

                        Console.WriteLine("");
                    }

                    // other
                    else if (arg0.Equals("/3/xy"))
                    {
                        Console.WriteLine(arg0);

                        var ba = packet.ToByteArray();

                        if (BitConverter.IsLittleEndian) Array.Reverse(ba);

                        float y = BitConverter.ToSingle(ba, 0);
                        float x = BitConverter.ToSingle(ba, 4);

                        Console.WriteLine(x);
                        Console.WriteLine(y);

                        Console.WriteLine("");
                    }


                    else
                    {
                        Console.WriteLine("**** unassiged address ****");
                        Console.WriteLine(arg0);
                    }

                    // DO SOMETHING HERE!
                }
            }
        }
        catch (Exception ex)
        {
            // if the socket was connected when this happens
            // then tell the user
            if (receiver.State == OscSocketState.Connected)
            {
                Console.WriteLine("Exception in listen loop");
                Console.WriteLine(ex.Message);
            }
        }
    }
}
```

以下の部分は、実際に使用する(対向する)iPhoneのIPアドレスを入れる：
```cs
     IPAddress sendAddress = IPAddress.Parse("192.168.1.6"); // IP address of iPhone(TouchOSC)
```

ライブラリとして、Rug.OSCを使用しているので　　
NuGetパッケージマネージャでインストールする。　　


## ほかのサンプル(python3)

ライブラリのインストール  

linuxの場合  
以下を実行する：  

```python

sudo apt install liblo-dev
pip install pyliblo3

```

Macの場合  
以下を実行する：  

```python

brew install liblo
pip install pyliblo3

```

windowsの場合
途中でエラーになり最後までインストールできなかったが
途中までを掲載する：  

```

git clone https://github.com/radarsat1/liblo.git
cd liblo\cmake
cmake -G "Visual Studio 17 2022"

1. liblo.sln を VisualStudio2022 で開く。
2. (Releaseにして)ビルドする。
3. liblo\cmake\Release に liblo.dll が生成される。
4. liblo.dll を C:\Windows\System32 にコピーする。
この時点で、liblo.dllがインストールされる。

----------------------------------------
以下で動作確認のテストプログラムを実行する：

liblo\cmake\tools\Release> ./oscdump osc.udp://:8000

iPhone(TouchOSC)にホストのIPアドレス(PCのもの)をセットして
フェイダーなどを動かすとPC側で受信したものが表示される。

liblo\cmake\tools\Release> ./oscsend 192.168.1.6 9000 /1/fader1 f 0.123
"192.168.1.6"のところは、iPhone(TouchOSC)のIPアドレスを入れる。
OSCメッセージがiPhone(TouchOSC)に送信される。
----------------------------------------

pip download pyliblo3
tar -xzf pyliblo3-0.13.0.tar.gz
cd pyliblo3-0.13.0

python setup.py build

ここで、エラー「'lo/lo.h':No such file or directory」になり終了！

```

OSCserverRecSend.py
```python
#!/usr/bin/env python

# OSCserverRecSend.py

# 2022/12/21

import liblo, sys

target = liblo.Address("192.168.1.6", 9000) # IP address of iPhone(TouchOSC)

# create server, listening on port 8000 for TouchOSC
try:
    server = liblo.Server(8000)
except liblo.ServerError as err:
    print( str(err) )
    sys.exit()

def adr1f(path, args):
    f = args
    print( "received '%s' : '%f'" % (path, f[0]) )
    # send test
    if path == "/1/fader1":
        liblo.send(target,"/1/fader2", f[0])
        liblo.send(target,"/1/fader5", f[0])

def adr2f(path, args):
    f = args
    print( "received '%s' : '%f','%f'" % (path, f[0], f[1]) )


def foo_baz_callback(path, args, types, src, data):
    print( "received message '%s'" % path )
    print( "blob contains %d bytes, user data was '%s'" % (len(args[0]), data) )

def fallback(path, args, types, src):
    print( "got unknown message '%s' from '%s'" % (path, src.url) )
    for a, t in zip(args, types):
        print( "argument of type '%s': %s" % (t, a) )

# register method taking an int and a float
server.add_method("/1/fader1", 'f', adr1f)
server.add_method("/1/fader2", 'f', adr1f)
server.add_method("/1/fader3", 'f', adr1f)
server.add_method("/1/fader4", 'f', adr1f)
server.add_method("/1/fader5", 'f', adr1f)
server.add_method("/3/xy", 'ff', adr2f)

# register method taking a blob, and passing user data to the callback
server.add_method("/foo/baz", 'b', foo_baz_callback, "blah")

# register a fallback for unhandled messages
server.add_method(None, None, fallback)

# loop and dispatch messages every 100ms
while True:
    #server.recv(100)
    server.recv(10)
```


## 参考情報   
C#関連：  
[dotnetでC#を動かす](https://xshigee.github.io/web0/md/dotnet_Cs.html)  

pythonインストール関連：  
[brewをインストールする - Macことはじめ](https://xshigee.github.io/web0/md/Mac_beginner.html)  
[scoopをインストール - windows10にplatformioをインストールする(scoop版)](https://beta-notes.way-nifty.com/blog/cat24313500/index.html)    

TouchOSC関連：
[TouchOSCMk1](https://hexler.net/touchosc-mk1)(昔からあるものがMK1としてある)  
[TouchOSC Next generation modular control surface](https://hexler.net/touchosc)  
[TouchOSC Editor/TouchOSC Bridge](https://hexler.net/touchosc-mk1#downloads)   


以上  

[Go to Toplevel](https://xshigee.github.io/web0/)  

