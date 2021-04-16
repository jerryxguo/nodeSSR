const ReactDOMServer = require('react-dom/server');
const hCardProps = `var hCardProps = {};`;

module.exports.respondHTML = (req, res) => {
  //console.log('respondHTML');
  //console.log(JSON.stringify(req.hCardProps));
  const appHTML = ReactDOMServer.renderToString(React.createElement(req.hCardComponent, req.hCardProps));
  // populate `#app` element with `appHTML`
  const finalHTML = 
      req.indexHTML.replace( '<div class="HcardApp" />', `<div class="HcardApp">${ appHTML }</div>` )
      .replace(hCardProps, 'var hCardProps ='+ JSON.stringify(req.hCardProps) + ";");
  //console.log(finalHTML);
  // set header and status
  res.contentType( 'text/html' );
  res.status( 200 );
  res.send( finalHTML );
  
};
