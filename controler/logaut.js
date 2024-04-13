const logout = (req, res) => {
    
    console.log("CHIAO")
    res.clearCookie('user');
    res.clearCookie('role');
    res.clearCookie('jwt');
    res.json({a:1});
  };
  
  module.exports = logout;