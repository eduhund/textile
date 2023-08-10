const echo = require("./echo/echo");
const pushData = require("./pushData/pushData");
const getData = require("./getData/getData");
const setData = require("./setData/setData");
const pullData = require("./pullData/pullData");

const METHODS = [
	{
		name: "echo",
		type: "all",
		exec: echo,
	},
	{
		name: "pushData",
		type: "post",
		exec: pushData,
	},
	{
		name: "getData",
		type: "get",
		exec: getData,
	},
	{
		name: "setData",
		type: "post",
		exec: setData,
	},
	{
		name: "pullData",
		type: "get",
		exec: pullData,
	},
];

module.exports = METHODS;
