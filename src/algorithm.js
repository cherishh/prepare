const twoSum = (list, target) => {
  const map = new Map();

  for (let i = 0; i < list.length; i++) {
    const diff = target - list[i];
    if (map.has(diff) && map.get(diff) !== i) {
      return [i, map.get(diff)];
    } else {
      map.set(list[i], i);
    }
  }
};

const permute = (list) => {
  const res = [];
  const fn = (arr = []) => {
    if (arr.length === list.length && !res.includes(arr)) {
      res.push(arr);
    } else {
      list.forEach((item) => {
        if (!arr.includes(item)) {
          fn([...arr, item]);
        }
      });
    }
  };
  fn();
  return res;
};

const skuPermute = (list) => {
  return list.reduce((acc, curr) => {
    return acc.flatMap((item) => {
      return curr.map((y) => {
        return [item, y].flat();
      });
    });
  });
};

const isValid = (str) => {
  const map = {
    "(": ")",
    "[": "]",
    "{": "}"
  };
  const stack = [];
  const splited = str.split("");
  for (let i; i < splited.length; i++) {
    if (map.hasOwnProperty(splited[i])) {
      stack.push(splited[i]);
    } else {
      if (splited[i] !== map(stack.pop())) {
        return false;
      }
    }
  }

  return stack.length === 0;
};

const lengthOfLIS = (list) => {
  const dp = new Array(list.length).fill(1);

  for (let i = 0; i < list.length; i++) {
    for (let j = 0; j < i; j++) {
      if (list[i] > list[j]) {
        dp[i] = Math.max(dp[i], dp[j + 1]);
      }
    }
  }

  return Math.max(...dp);
};

const merge = (l1, l2) => {
  if (!l1.next) return l2;
  if (!l2.next) return l1;

  if (l1.value < l2.value) {
    l1.next = merge(l1.next, l2);
    return l1;
  } else {
    l2.next = merge(l1, l2.next);
    return l2;
  }
};

const maxSubArray = (nums) => {
  if (nums.length === 1) {
    return nums[0];
  }

  let maxEndingHere = nums[0];
  let maxSoFar = nums[0];
  for (let i = 0; i < nums.length; i++) {
    maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);
    maxSoFar = Math.max(maxSoFar, maxEndingHere);
  }
  maxSoFar;
};

const palindrome = (num) => {
  if (num < 0) return false;
  let arr = num.toString().split("");
  const len = arr.length;
  const firstHalf = arr.slice(0, Math.floor(len / 2));
  let lastHalf = arr.slice(Math.floor(len / 2));
  const isOddNum = len % 2;

  console.log(firstHalf, lastHalf);
  if (isOddNum) {
    lastHalf.splice(0, 1);
  }
  console.log(firstHalf, lastHalf);
  return firstHalf.join("") === lastHalf.reverse().join("");
};

// https://leetcode-cn.com/problems/merge-sorted-array/solution/he-bing-liang-ge-you-xu-shu-zu-by-leetco-rrb0/
const mergeArr = (nums1, m, nums2, n) => {
  let p1 = 0;
  let p2 = 0;
  let curr = 0;
  const sorted = new Array(m + n).fill(0);

  while (p1 < m || p2 < n) {
    if (p1 === m) {
      curr = nums2[p2++];
    } else if (p2 === n) {
      curr = nums1[p1++];
    } else if (nums1[p1] < nums2[p2]) {
      curr = nums1[p1++];
    } else {
      curr = nums2[p2++];
    }
    sorted[p1 + p2 - 1] = curr;
  }

  for (let i = 0; i < sorted.length; i++) {
    nums1[i] = sorted[i];
  }
};

const isSymTree = (node) => {
  const check = (p, q) => {
    if (!p && !q) return true;
    if (!p || !q) return false;
    return p.val === q.val && check(p.left, q.right) && check(p.right, q.left);
  };
  check(node.left, node.right);
};

const maxDepth = (node) => {
  if (node === null) return 0;
  return Math.max(maxDepth(node.left), maxDepth(node.right)) + 1;
};

const invertTree = (node) => {
  if (node === null) return null;
  let temp = node.left;
  node.left = node.rigt;
  node.right = temp;
  invertTree(node.left);
  invertTree(node.right);
  return node;
};

const mergeTree = (node1, node2) => {
  if (!node1 && node2) {
    return node2;
  }
  if ((node1 === null && node2 === null) || (node1 && node2 === null)) {
    return node1;
  }
  node1.val = node1.val + node2.val;
  node1.left = mergeTree(node1.left, node2.left);
  node1.right = mergeTree(node1.right, node2.right);
  return node1;
};

const invertChain = (node) => {
  let prev = null;
  let curr = node;
  while (curr) {
    let next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
};

const strAdd = (n1, n2) => {
  let res = "";
  let flag = 0;
  while (n1.length < n2.length) {
    n1 = "0" + n1;
  }
  while (n1.length > n2.length) {
    n2 = "0" + n2;
  }
  let i = n1 - 1;
  while (i > 0) {
    flag = Number(n1[i]) + Number(n2[i]) + flag;
    res = (flag % 10) + res;
    flag = flag >= 10 ? 1 : 0;
    i--;
  }
  return (res = flag === 1 ? "1" + res : res);
};

const nodeListAdd = (l1, l2) => {
  function ListNode(val) {
    this.val = val;
    this.next = null;
  }
  const lst2Arr = (list) => {
    const res = [];
    while (list.next) {
      res.push(list.val);
      list = list.next;
    }
    return res;
  };
  const arr2Lst = (arr) => {
    const nodes = arr.map((item) => new NodeList(item));
    for (let i = 0; i < nodes.length; i++) {
      nodes[i + 1] && (nodes[i].next = nodes[i + 1]);
    }
    return nodes[0];
  };
  const add = (arr1, arr2) => {
    let str1 = arr1.join("");
    let str2 = arr2.join("");
    while (str1.length < str2.length) {
      str1 = str1 + "0";
    }
    while (str2.length < str1.length) {
      str2 = str2 + "0";
    }
    let i = 0;
    let flag = 0;
    let res = 0;
    while (i < str1.length - 1) {
      str1[i] = Number(str1[i]) + Number(str2[i]) + flag;
      res = (flag % 10) + res;
      flag = flag >= 10 ? 1 : 0;
      i++;
    }
    res = flag === 1 ? res + "1" : res;
    return res.split("");
  };
  const arr1 = lst2Arr(l1);
  const arr2 = lst2Arr(l2);
  return arr2Lst(add(arr1, arr2));
};

// https://leetcode-cn.com/problems/longest-substring-without-repeating-characters/solution/tong-su-yi-dong-cong-bao-li-dao-hua-dong-cucu/
const LongestSubString = (str) => {
  const len = str.length;
  let res = 0;
  for (let i = 0; i < len; i++) {
    const arr = [];
    let maxLen = 0;
    let j = i;
    while (j < len && !arr.includes(str[j])) {
      arr.push(str[j]);
      maxLen++;
      j++;
    }
    res = Math.max(res, maxLen);
  }
  return res;
};

const invertInt = (num) => {
  if (num === 0) return 0;
  const isNegative = num < 0;
  let str;
  if (isNegative) {
    str = num.toString().split("").slice(1).reverse().join("");
  } else {
    str = num.toString().split("").reverse().join("");
  }
  while (str.charAt(0) === "0") {
    str = str.substring(1);
  }
  return isNegative ? Number("-" + str) : Number(str);
};

const maxProfit = (prices) => {
  const res = [];
  for (let i = 0; i < prices.length; i++) {
    const arr = [];
    for (let j = i + 1; j < prices.length; j++) {
      const diff = prices[j] - prices[i];
      diff > 0 && arr.push(diff);
    }
    arr.length !== 0 && res.push(Math.max(...arr));
  }
  return res.length === 0 ? 0 : Math.max(...res);
};

const biTreeMinDepth = (root) => {
  if (root === null) return 0;
  if (root.left === null && root.right === null) return 1;
  const m1 = biTreeMinDepth(root.left);
  const m2 = biTreeMinDepth(root.right);
  if (root.left === null || root.right === null) return m1 + m2 + 1;
  return Math.min(m1, m2) + 1;
};

const trapWater = (heights) => {
  let [left, right] = [0, heights.length - 1];
  let [leftMax, rightMax] = [0, 0];
  let res = 0;

  while (left < right) {
    if (heights[left] < heights[right]) {
      if (heights[left] >= leftMax) {
        leftMax = heights[left];
      } else {
        res = res + (leftMax - heights[left]);
      }
      left++;
    } else {
      if (heights[right] >= rightMax) {
        rightMax = heights[right];
      } else {
        res = res + (rightMax - heights[right]);
      }
      right--;
    }
  }
  return res;
};

export const threeEqSum = (list) => {
  if (list.length < 3) return false;
  if (list.length === 3) {
    return list[0] === list[1] && list[1] === list[2];
  }
  const getSum = (arr) => arr.reduce((acc, curr) => acc + curr);
  const totalSum = getSum(list);
  if (totalSum % 3 !== 0) return false;
  const target = totalSum / 3;
  let [len, i, curr] = [list.length, 0, 0];
  while (i < len) {
    curr = curr + list[i];
    if (curr === target) {
      break;
    }
    i++;
  }
  if (curr !== target) return false;
  let j = i + 1;
  while (j + 1 < len) {
    curr = curr + list[i];
    if (curr === target * 2) return true;
    j++;
  }
  return true;
};

export const longestPalindrome = (s) => {
  let res = "";
  let len = s.length;
  if (len < 2) return s;
  if (len === 2) return s[0];
  for (let i = 0; i < len; i++) {
    for (let j = i + 1; j < len; j++) {
      let subStr = s.substring(i, j);
      let subLen = subStr.length;
      let reversed = subStr.split("").reverse().join("");
      if (subStr === reversed && res.length < subLen) {
        res = subStr;
      }
    }
  }
  return res;
};

export const rob = (list) => {
  if (list.length === 0) return 0;
  if (list.length === 1) return list[0];
  const dp = new Array(list.length).fill(0);
  dp[0] = list[0];
  dp[1] = Math.max(list[0], list[1]);
  for (let i = 2; i < list.length; i++) {
    dp[i] = Math.max(dp[i - 2] + list[i], dp[i - 1]);
  }
  return dp[dp.length - 1];
};

export const maxSubArray2 = (list) => {
  let currSum = 0;
  let maxSum = list[0];
  for (let i = 0; i < list.length; i++) {
    currSum = Math.max(currSum + list[i], list[i]);
    maxSum = Math.max(maxSum, currSum);
  }
  return maxSum;
};

export const permute2 = (list) => {
  const res = [];
  const fn = (arr = []) => {
    if (arr.length === list.length && !res.includes(arr)) {
      res.push(arr);
    } else {
      list.forEach((item) => {
        if (!arr.includes(item)) {
          fn(...arr, item);
        }
      });
    }
  };
  fn();
  return res;
};

export const matrixSearch = (matrix, target) => {
  // 手写二分查找
  const search = (list, target) => {
    let [low, high] = [0, list.length - 1];
    while (low <= high) {
      const mid = Math.floor((high - low) / 2) + low;
      const num = list[mid];
      if (num === target) {
        return mid;
      } else if (num > target) {
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }
    return -1;
  };
  for (const row of matrix) {
    const idx = search(row, target);
    if (idx >= 0) {
      return true;
    }
  }
  return false;
};

export const revertList = (head) => {
  let prev = null;
  let curr = head;

  while (curr !== null) {
    let next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }

  return prev;
};

const trailingZeros = (n) => {
  const getNum = (x) => {
    if (x === 1) return 1;
    if (x === 2) return 2;

    return x * getNum(x - 1);
  };

  const arr = getNum(n).toString().split("").reverse();
  let count = 0;
  while (arr[0] === "0") {
    count++;
    arr.shift();
  }

  return count;
};

const change = (target, list) => {
  const dp = new Array(target + 1).fill(0);
  dp[0] = 1;
  for (const coin of list) {
    for (let i = 0; i < target; i++) {
      dp[i] = dp[i] + dp[i - coin];
    }
  }
};

const kthToLast = (head, k) => {
  let p1 = head;
  let p2 = head;
  while (k > 0) {
    p1 = p1.next;
    k--;
  }
  while (p1) {
    p1 = p1.next;
    p2 = p2.next;
  }
  return p2.val;
};

const maxDepth2 = (root) => {
  if (!root) return 0;
  return Math.max(maxDepth2(root.left), maxDepth2(root.right)) + 1;
};

export const removeDup = (list) => {
  if (list.length === 0) return 0;
  let p1 = 1;
  let p2 = 1;
  while (p1 <= list.length - 1) {
    if (list[p1] !== list[p1 - 1]) {
      list[p2] = list[p1];
      p2++;
    }
    p1++;
  }
  return p2;
};

export const mergeList = (l1, l2) => {
  if (!l1) return l2;
  if (!l2) return l1;

  if (l1.val < l2.val) {
    l1.next = mergeList(l1.next, l2);
    return l1;
  } else {
    l2.next = mergeList(l1, l2.next);
    return l2;
  }
};

export const deleteNode = (head, target) => {
  if (!head) return null;
  if (head.val === target) return head;

  let temp = head;
  while (temp.next && temp.val !== target) {
    temp = temp.next;
  }
  if (temp.val === target) {
    temp.next = temp.next.next;
  }
  return head;
};

export const moveZeros = (list) => {
  let j = 0;
  for (let i = 0; i < list.length; i++) {
    if (list[i] !== 0) {
      list[j] = list[i];
      j++;
    }
  }
  for (let x = j; x < list.length; x++) {
    list[x] = 0;
  }
  return list;
};

export const isSymetric = (root) => {
  const check = (left, right) => {
    if (!left && !right) return true;
    if (!left || !right) return false;
    return (
      left.val === right.val &&
      check(left.left, left.right) &&
      check(right.left, right.right)
    );
  };
  return check(root.left, root.right);
};

export const diameterOfBiTree = (root) => {
  let ans = 0;
  const getDepth = (node) => {
    if (!node) return null;
    let left = getDepth(node.left);
    let right = getDepth(node.right);
    ans = Math.max(ans, left + right);
    return Math.max(left, right) + 1;
  };
  getDepth(root);
  return ans;
};

// 牛顿法
export const mySqrt2 = (x) => {
  let n = x;
  while (n * n > x) {
    n = Math.floor((n + x / n) / 2);
  }
  return n;
};

export const deleteDupInList = (head) => {
  if (!head) return head;
  let curr = head;
  while (curr.next) {
    if (curr.val === curr.next.val) {
      curr.next = curr.next.next;
    } else {
      curr = curr.next;
    }
  }
  return head;
};

export const combinationSum = (list, target) => {
  const res = [];
  const dfs = (target, combine, idx) => {
    if (idx === list.length) {
      return;
    }
    if (target === 0) {
      res.push(combine);
      return;
    }
    // 跳过当前idx的情况
    dfs(target, combine, idx + 1);
    // 选择当前数
    if (target - list[idx] >= 0) {
      dfs(target - list[idx], [...combine, list[idx]], idx);
    }
  };
  dfs(target, [], 0);
  return res;
};

export const threeSumToZero = (list) => {};
