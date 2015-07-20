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
This version is Typescript/AngularJS <br/>
cKit.js is no longer bound to the Angular App, which means you may run the animation widget via patch code free of a UI
<br/>

<p> After cloning the project run </p>
<div class="highlight highlight-bash">
<pre> npm install; npm install; tsd reinstall;
grunt
</pre>

<pre>
pushd dist; python -m SimpleHTTPServer 8080; popd;
</pre>
</div>

<h4>Improvements & Features To be Completed</h4>
Make a keyframe GUI <br/>
GIF Encoding (WIP)<br/>
Animating Text<br/>
Shaders<br/>
Document & subroutine a barebone cKit.js for a widget with patch data without the UI<br/>
Code minification grunt build<br/>


