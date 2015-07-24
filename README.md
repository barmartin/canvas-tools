canvas-tools
============

<h3>Tools for HTML5 Canvas Animation</h3>

<h4> General </h4>
0.5.0 is really close to something I wanna post to the forums <br/>
Hasn't been debugged properly yet, but its strongly typed and classed <br/>
It should be fairly easy to add custom objects inheriting from baseObject.ts <br/>
The main issue that should probably be addressed before posting as a library <br/>
is backward compatibility with the patch i/o, it breaks often when adding capability <br/>

<h4>Notes on Use</h4>
Modifying the configuration changes the current keyframe selected in the animation frame. <br/>
The right arrow ->: builds a new keyframe if one does not exist.<br/>
The left arrow <-: goes back a keyframe<br/>
S: starts animation<br/>
A: stops animation<br/>
1-4 selects one of up to four objects in the scene.<br/>
Edit Modes: (q) -> shape, (w) -> transforms, (e) -> none<br/>

<a href="http://thebarry.github.io/canvas-tools/#/" target="_blank">Demo Here</a>

<h3> Development </h3>
This version is Typescript/AngularJS <br/>
cKit.js is no longer bound to the Angular App, which means you may run the animation widget via patch code free of a UI
<br/>

<p> Global dev dependencies</p>
<p>XCode comes with the general CLI tools needed</p>
<pre>npm install tsd -g </pre>

<p> After cloning the project run </p>
<div class="highlight highlight-bash">
<pre> npm install; tsd reinstall; grunt;</pre>

<pre> pushd dist; python -m SimpleHTTPServer 8080; popd; </pre>
<p> The app is now published to http://localhost:8080/#/ </p> 
</div>

<h4>Improvements & Features To be Completed</h4>
Bugs happening with line color -> global settings <br/>
Bugs happening with transform -> image placement outside (efficiency) radius
Patcher backward capability will hopefully be addressed (this) 0.5.0 on <br/>
Make a keyframe GUI <br/>
GIF Encoding (WIP) <br/>
Text -> Fonts, proper fill/gradients (WIP) <br/>
Shaders for geometry <br/>
4 -> 10+ scene object support (WIP) <br/>
Document & subroutine a barebone cKit.js for a widget with patch data without the UI<br/>
Code minification grunt build<br/>
Tesselations layering for all object types <br/>
Image Layers -> Fill Image Option <br/>
Image Layers -> Background Image <br/>
More efficient json -> patch algorithm (its stupid huge) <br/>
... too many features to list


