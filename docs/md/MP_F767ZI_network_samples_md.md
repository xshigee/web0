
2021/1/3  
初版  

MicroPython(F767ZI ) Network Samples
# MicroPython(F767ZI ) Network Samples

## 概要
MicroPython(F767ZI) Network Samples  

この記事は「
[MicroPython(F767ZI)でStartwars(AsciiArt)を動かす](https://beta-notes.way-nifty.com/blog/2020/12/post-e4d00f.html)
 」の続編にあたり、NetworkアクセスSamplesを記述している。ネットワークの接続が完了すれば、それ以降はESP8266のmicropythonとほぼ同じようだ。   
(ホストはubuntuを想定している)

## sample1

http_get\.py
```python

# ネットワークを有効化する
import network
nic = network.LAN()
nic.active(1)

# 以下はESP8266のサンプルと全く同じ

def http_get(url):
    import socket
    _, _, host, path = url.split('/', 3)
    addr = socket.getaddrinfo(host, 80)[0][-1]
    s = socket.socket()
    s.connect(addr)
    s.send(bytes('GET /%s HTTP/1.0\r\nHost: %s\r\n\r\n' % (path, host), 'utf8'))
    while True:
        data = s.recv(100)
        if data:
            print(str(data, 'utf8'), end='')
        else:
            break
    s.close()

print(http_get('http://micropython.org/ks/test.html'))

```

REPL実行例：
```
paste mode; Ctrl-C to cancel, Ctrl-D to finish
=== import network
=== nic = network.LAN()
=== nic.active(1)
=== 
=== 
>>> nic.ifconfig()
('192.168.0.18', '255.255.255.0', '192.168.0.4', '192.168.0.4')
>>> 
paste mode; Ctrl-C to cancel, Ctrl-D to finish
=== 
=== def http_get(url):
===     import socket
===     _, _, host, path = url.split('/', 3)
===     addr = socket.getaddrinfo(host, 80)[0][-1]
===     s = socket.socket()
===     s.connect(addr)
===     s.send(bytes('GET /%s HTTP/1.0\r\nHost: %s\r\n\r\n' % (path, host), 'utf8'))
===     while True:
===         data = s.recv(100)
===         if data:
===             print(str(data, 'utf8'), end='')
===         else:
===             break
===     s.close()
=== 
=== print(http_get('http://micropython.org/ks/test.html'))
=== 
=== 
```

REPL出力結果：
```
HTTP/1.1 200 OK
Server: nginx/1.10.3
Date: Sun, 03 Jan 2021 09:54:59 GMT
Content-Type: text/html
Content-Length: 180
Last-Modified: Tue, 03 Dec 2013 00:16:26 GMT
Connection: close
Vary: Accept-Encoding
ETag: "529d22da-b4"
Accept-Ranges: bytes

<!DOCTYPE html>
<html lang="en">
    <head>
        <title>Test</title>
    </head>
    <body>
        <h1>Test</h1>
        It's working if you can read this!
    </body>
</html>
None
```

## sample2

目的のプログラム実行前に   
以下を実行して
ネットワークの有効化と  
IPアドレスの確認を行なう。
```

import network
nic = network.LAN()
nic.active(1)

nic.ifconfig()
```

httpserver\.py
```python


# 以下はESP8266のサンプルを差分のあるmachine関係をコメントアウトしたもの

#import machine
#pins = [machine.Pin(i, machine.Pin.IN) for i in (0, 2, 4, 5, 12, 13, 14, 15)]

html = """<!DOCTYPE html>
<html>
    <head> <title>ESP8266 Pins</title> </head>
    <body> <h1>ESP8266 Pins</h1>
        <table border="1"> <tr><th>Pin</th><th>Value</th></tr> %s </table>
    </body>
</html>
"""

import socket
addr = socket.getaddrinfo('0.0.0.0', 80)[0][-1]

s = socket.socket()
s.bind(addr)
s.listen(1)

print('listening on', addr)

while True:
    cl, addr = s.accept()
    print('client connected from', addr)
    cl_file = cl.makefile('rwb', 0)
    while True:
        line = cl_file.readline()
        if not line or line == b'\r\n':
            break

#rows = ['<tr><td>%s</td><td>%d</td></tr>' % (str(p), p.value()) for p in pins]
    rows = ['<tr><td>ABC</td><td>123</td></tr>']
    response = html % '\n'.join(rows)
    cl.send('HTTP/1.0 200 OK\r\nContent-type: text/html\r\n\r\n')
    cl.send(response)
    cl.close()

```

REPL実行例：
```

>>> nic.active()
True
>>> nic.ifconfig()
('192.168.0.18', '255.255.255.0', '192.168.0.4', '192.168.0.4')
>>> 
# 上の192.168.0.18がサーバーアドレスになるので覚えておいてサーバー起動後、このIPアドレスにアクセスする

paste mode; Ctrl-C to cancel, Ctrl-D to finish
=== #import machine
=== #pins = [machine.Pin(i, machine.Pin.IN) for i in (0, 2, 4, 5, 12, 13, 14, 15)]
=== 
=== html = """<!DOCTYPE html>
=== <html>
===     <head> <title>ESP8266 Pins</title> </head>
===     <body> <h1>ESP8266 Pins</h1>
===         <table border="1"> <tr><th>Pin</th><th>Value</th></tr> %s </table>
===     </body>
=== </html>
=== """
=== 
=== import socket
=== addr = socket.getaddrinfo('0.0.0.0', 80)[0][-1]
=== 
=== s = socket.socket()
=== s.bind(addr)
=== s.listen(1)
=== 
=== print('listening on', addr)
=== 
=== while True:
===     cl, addr = s.accept()
===     print('client connected from', addr)
===     cl_file = cl.makefile('rwb', 0)
===     while True:
===         line = cl_file.readline()
===         if not line or line == b'\r\n':
===             break
=== 
=== #rows = ['<tr><td>%s</td><td>%d</td></tr>' % (str(p), p.value()) for p in pins]
===     rows = ['<tr><td>ABC</td><td>123</td></tr>']
===     response = html % '\n'.join(rows)
===     cl.send('HTTP/1.0 200 OK\r\nContent-type: text/html\r\n\r\n')
===     cl.send(response)
===     cl.close()
=== 
=== 
```
上でサーバーを起動したら
確認したIPアドレス(192.128.0.xxx:80)で
ブラウザー・アクセスする。

REPL出力例：
```
listening on ('0.0.0.0', 80)
client connected from ('192.168.0.2', 56016)
44
229
client connected from ('192.168.0.2', 56018)
44
229
```

ウェブ画面表示例：

ESP8266 Pins

| Pin |	Value | 
|---|---|   
| ABC |	123 |   


## 参考情報

https://docs.micropython.org/en/latest/esp8266/tutorial/network_basics.html  
https://docs.micropython.org/en/latest/esp8266/tutorial/network_tcp.html   

・[M5Stack MicroPython API調査記録　ネットワーク編](https://qiita.com/inachi/items/a8841deceafcbf8a4e2a)   
・[ESP32/ESP8266のMicroPythonでMQTTを使ってみた](https://beta-notes.way-nifty.com/blog/2020/03/post-bdef2a.html)  
・[ESP32のMicroPythonでOSC(Open Sound Control)で通信する](https://beta-notes.way-nifty.com/blog/2020/02/post-15dff0.html)  


以上
