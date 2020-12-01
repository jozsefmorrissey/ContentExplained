This is my first browser extension.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To install locally:
<pre>
Settings -> Web Developer -> Remote Debugging -> This FireFox -> Load Temporary Add-on...
</pre>


Server Updates:
rebooting the server will change the serverId this values is sent in all
responses as a ce-server-id header. Changing this value will notify all running
applications that the server has been updated. Which will cause them to update
thier...
<ul>
  <li>endpoints</li>
</ul>

##Firefox policy requirments

### Build Requirements
  should work with any os however have tested
    - Linux Mint 19.3 Tricia 64-bit
    -
  requried installations
    - node (8.10.0)
    - npm (3.5.2)
  installed
### Install
npm install
### Build Process
  node ./watch.js [local|dev|prod]
