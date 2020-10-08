class RegArr {
  constructor(string, array) {
    const newLine = 'akdiehtpwksldjfurioeidu';
    const noNewLines = string.replace(/\n/g, newLine);
    const stack = [{str: noNewLines, index: 0}];
    const details = {};
    let finalStr = '';
    const obj = {};
    array = array.concat({name: 'untouched', regex: /(.*)/g, actionM: null});

    obj.original = function () {return string;};
    obj.result = function () {return finalStr};
    obj.details = function () {return details};

    function split(str, array) {
      const splitted = [];
      for (let index = 0; array && index < array.length; index += 1) {
        const elem = array[index];
        const startIndex = str.indexOf(elem);
        if (startIndex !== -1) {
          const length = elem.length;
          if (startIndex !== 0 ) {
            splitted.push(str.substring(0, startIndex));
          }
          str = str.substring(startIndex + length);
        }
      }
      if (str.length > 0) {
          splitted.push(str);
      }
      return splitted;
    }

    function next(str, action, regex) {
      if (str === null) return;
      console.log(action, action === null);
      if (action !== undefined) {
        if (Number.isInteger(action)) {
          stack.push({str, index: action})
        } else if (action !== null) {
          stack.push({str: str.replace(regex, action), index: array.length - 1});
        } else {
          finalStr += str;
        }
      } else {
        stack.push({str, index: array.length - 1});
      }
    }

    function idk(arr1, arr1Action, arr2, arr2Action, regex) {
      for (let index = arr1.length - 1; index > -1; index -= 1) {
        if (arr2 && arr2[index]) {
          next(arr2[index], arr2Action, regex);
        }
        next(arr1[index], arr1Action, regex);
      }
    }

    function addDetails(name, attr, array) {
      if (!array) return;
      array = array.map(function (value) {return value.replace(new RegExp(newLine, 'g'), '\n')});
      if (!details[name]) details[name] = {};
      if (!details[name][attr]) details[name][attr] = [];
      details[name][attr] = details[name][attr].concat(array);
    }

    function construct(str, index) {
      if (str === undefined) return;
      const elem = array[index];
      const matches = str.match(elem.regex);
      const splitted = split(str, matches);
      addDetails(elem.name, 'matches', matches);
      addDetails(elem.name, 'splitted', splitted);
      let finalStr = '';
      if (matches && matches[0] && str.indexOf(matches[0]) === 0) {
        idk(matches, elem.actionM, splitted, elem.actionS, elem.regex);
      } else {
        idk(splitted, elem.actionS, matches, elem.actionM, elem.regex);
      }
    }

    function process() {
      while (stack.length > 0) {
        const curr = stack.pop();
        construct(curr.str, curr.index);
      }
      finalStr = finalStr.replace(new RegExp(newLine, 'g'), '\n');
    }
    process();
    return obj;
  }
}

try{
	exports.RegArr = RegArr;
} catch (e) {}
