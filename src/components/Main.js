require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

//let yeomanImage = require('../images/1.jpg');
let imageDatas = require('../data/imageData.json');
imageDatas = (function(imageDataArr){
	 for(let i = 0 ,j = imageDataArr.length; i < j ;i++){
	 	var singalImage = imageDataArr[i];

	 	singalImage.url = require("../images/" + singalImage.fileName);

	 	imageDataArr[i] = singalImage;
	 }

	 return imageDataArr;
})(imageDataArr);  

class AppComponent extends React.Component {
  render() {
    return (
    	<div>
    	<section className="stage">
    		<section className="img-sec">
    		</section>			
    		<nav className="controller-nav"></nav>	
    	</section>	
    	</div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
