canvas-tools
============

<h3>Tools for HTML5 Canvas Animation</h3>

<h4>Notes on Use</h4>
Modifying the configuration changes the current keyframe selected in the animation frame. <br/>
The right arrow ->: builds a new keyframe if one does not exist.<br/>
The left arrow <-: goes back a keyframe<br/>
S: starts animation<br/>
A: stops animation<br/>
1-4 selects one of up to four objects in the scene.<br/>
Edit Modes: (q) -> shape, (w) -> transforms, (e) -> none<br/>

<a href="http://thebarry.github.io/canvas-tools/" target="_blank">Demo Here</a>

<h3> Development </h3>
Just did a complete rebuild of the project to use AngularAMD <br/>
If you want to develop without AngularJS you can use commit 4571e648fae1374cf91eb4568a22527d5c7be721 <br/>

<p> After cloning the project run </p>
<div class="highlight highlight-bash">
<pre>bower install
npm install

--To run development server--
grunt devel

--Prod server--
grunt deploy 
--in /dist--
python -m SimpleHttpServer 8080
</pre>
</div>

<h4>Improvements & Features To be Completed</h4>
GIF Encoding (WIP)<br/>
Animating Text<br/>
Image Scaling<br/>
Shaders<br/>
All Keyframe Transform<br/>
Document how to use barebone cKit.js for a widget with JSON data without the UI<br/>
