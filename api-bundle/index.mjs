var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// node_modules/superjson/dist/double-indexed-kv.js
var DoubleIndexedKV;
var init_double_indexed_kv = __esm({
  "node_modules/superjson/dist/double-indexed-kv.js"() {
    DoubleIndexedKV = class {
      constructor() {
        this.keyToValue = /* @__PURE__ */ new Map();
        this.valueToKey = /* @__PURE__ */ new Map();
      }
      set(key, value) {
        this.keyToValue.set(key, value);
        this.valueToKey.set(value, key);
      }
      getByKey(key) {
        return this.keyToValue.get(key);
      }
      getByValue(value) {
        return this.valueToKey.get(value);
      }
      clear() {
        this.keyToValue.clear();
        this.valueToKey.clear();
      }
    };
  }
});

// node_modules/superjson/dist/registry.js
var Registry;
var init_registry = __esm({
  "node_modules/superjson/dist/registry.js"() {
    init_double_indexed_kv();
    Registry = class {
      constructor(generateIdentifier) {
        this.generateIdentifier = generateIdentifier;
        this.kv = new DoubleIndexedKV();
      }
      register(value, identifier) {
        if (this.kv.getByValue(value)) {
          return;
        }
        if (!identifier) {
          identifier = this.generateIdentifier(value);
        }
        this.kv.set(identifier, value);
      }
      clear() {
        this.kv.clear();
      }
      getIdentifier(value) {
        return this.kv.getByValue(value);
      }
      getValue(identifier) {
        return this.kv.getByKey(identifier);
      }
    };
  }
});

// node_modules/superjson/dist/class-registry.js
var ClassRegistry;
var init_class_registry = __esm({
  "node_modules/superjson/dist/class-registry.js"() {
    init_registry();
    ClassRegistry = class extends Registry {
      constructor() {
        super((c) => c.name);
        this.classToAllowedProps = /* @__PURE__ */ new Map();
      }
      register(value, options) {
        if (typeof options === "object") {
          if (options.allowProps) {
            this.classToAllowedProps.set(value, options.allowProps);
          }
          super.register(value, options.identifier);
        } else {
          super.register(value, options);
        }
      }
      getAllowedProps(value) {
        return this.classToAllowedProps.get(value);
      }
    };
  }
});

// node_modules/superjson/dist/util.js
function valuesOfObj(record) {
  if ("values" in Object) {
    return Object.values(record);
  }
  const values = [];
  for (const key in record) {
    if (record.hasOwnProperty(key)) {
      values.push(record[key]);
    }
  }
  return values;
}
function find(record, predicate) {
  const values = valuesOfObj(record);
  if ("find" in values) {
    return values.find(predicate);
  }
  const valuesNotNever = values;
  for (let i = 0; i < valuesNotNever.length; i++) {
    const value = valuesNotNever[i];
    if (predicate(value)) {
      return value;
    }
  }
  return void 0;
}
function forEach(record, run) {
  Object.entries(record).forEach(([key, value]) => run(value, key));
}
function includes(arr, value) {
  return arr.indexOf(value) !== -1;
}
function findArr(record, predicate) {
  for (let i = 0; i < record.length; i++) {
    const value = record[i];
    if (predicate(value)) {
      return value;
    }
  }
  return void 0;
}
var init_util = __esm({
  "node_modules/superjson/dist/util.js"() {
  }
});

// node_modules/superjson/dist/custom-transformer-registry.js
var CustomTransformerRegistry;
var init_custom_transformer_registry = __esm({
  "node_modules/superjson/dist/custom-transformer-registry.js"() {
    init_util();
    CustomTransformerRegistry = class {
      constructor() {
        this.transfomers = {};
      }
      register(transformer) {
        this.transfomers[transformer.name] = transformer;
      }
      findApplicable(v) {
        return find(this.transfomers, (transformer) => transformer.isApplicable(v));
      }
      findByName(name) {
        return this.transfomers[name];
      }
    };
  }
});

// node_modules/superjson/dist/is.js
var getType, isUndefined, isNull, isPlainObject, isEmptyObject, isArray, isString, isNumber, isBoolean, isRegExp, isMap, isSet, isSymbol, isDate, isError, isNaNValue, isPrimitive, isBigint, isInfinite, isTypedArray, isURL;
var init_is = __esm({
  "node_modules/superjson/dist/is.js"() {
    getType = (payload) => Object.prototype.toString.call(payload).slice(8, -1);
    isUndefined = (payload) => typeof payload === "undefined";
    isNull = (payload) => payload === null;
    isPlainObject = (payload) => {
      if (typeof payload !== "object" || payload === null)
        return false;
      if (payload === Object.prototype)
        return false;
      if (Object.getPrototypeOf(payload) === null)
        return true;
      return Object.getPrototypeOf(payload) === Object.prototype;
    };
    isEmptyObject = (payload) => isPlainObject(payload) && Object.keys(payload).length === 0;
    isArray = (payload) => Array.isArray(payload);
    isString = (payload) => typeof payload === "string";
    isNumber = (payload) => typeof payload === "number" && !isNaN(payload);
    isBoolean = (payload) => typeof payload === "boolean";
    isRegExp = (payload) => payload instanceof RegExp;
    isMap = (payload) => payload instanceof Map;
    isSet = (payload) => payload instanceof Set;
    isSymbol = (payload) => getType(payload) === "Symbol";
    isDate = (payload) => payload instanceof Date && !isNaN(payload.valueOf());
    isError = (payload) => payload instanceof Error;
    isNaNValue = (payload) => typeof payload === "number" && isNaN(payload);
    isPrimitive = (payload) => isBoolean(payload) || isNull(payload) || isUndefined(payload) || isNumber(payload) || isString(payload) || isSymbol(payload);
    isBigint = (payload) => typeof payload === "bigint";
    isInfinite = (payload) => payload === Infinity || payload === -Infinity;
    isTypedArray = (payload) => ArrayBuffer.isView(payload) && !(payload instanceof DataView);
    isURL = (payload) => payload instanceof URL;
  }
});

// node_modules/superjson/dist/pathstringifier.js
var escapeKey, stringifyPath, parsePath;
var init_pathstringifier = __esm({
  "node_modules/superjson/dist/pathstringifier.js"() {
    escapeKey = (key) => key.replace(/\./g, "\\.");
    stringifyPath = (path) => path.map(String).map(escapeKey).join(".");
    parsePath = (string) => {
      const result = [];
      let segment = "";
      for (let i = 0; i < string.length; i++) {
        let char = string.charAt(i);
        const isEscapedDot = char === "\\" && string.charAt(i + 1) === ".";
        if (isEscapedDot) {
          segment += ".";
          i++;
          continue;
        }
        const isEndOfSegment = char === ".";
        if (isEndOfSegment) {
          result.push(segment);
          segment = "";
          continue;
        }
        segment += char;
      }
      const lastSegment = segment;
      result.push(lastSegment);
      return result;
    };
  }
});

// node_modules/superjson/dist/transformer.js
function simpleTransformation(isApplicable, annotation, transform, untransform) {
  return {
    isApplicable,
    annotation,
    transform,
    untransform
  };
}
function compositeTransformation(isApplicable, annotation, transform, untransform) {
  return {
    isApplicable,
    annotation,
    transform,
    untransform
  };
}
function isInstanceOfRegisteredClass(potentialClass, superJson) {
  if (potentialClass?.constructor) {
    const isRegistered = !!superJson.classRegistry.getIdentifier(potentialClass.constructor);
    return isRegistered;
  }
  return false;
}
var simpleRules, symbolRule, constructorToName, typedArrayRule, classRule, customRule, compositeRules, transformValue, simpleRulesByAnnotation, untransformValue;
var init_transformer = __esm({
  "node_modules/superjson/dist/transformer.js"() {
    init_is();
    init_util();
    simpleRules = [
      simpleTransformation(isUndefined, "undefined", () => null, () => void 0),
      simpleTransformation(isBigint, "bigint", (v) => v.toString(), (v) => {
        if (typeof BigInt !== "undefined") {
          return BigInt(v);
        }
        console.error("Please add a BigInt polyfill.");
        return v;
      }),
      simpleTransformation(isDate, "Date", (v) => v.toISOString(), (v) => new Date(v)),
      simpleTransformation(isError, "Error", (v, superJson) => {
        const baseError = {
          name: v.name,
          message: v.message
        };
        superJson.allowedErrorProps.forEach((prop) => {
          baseError[prop] = v[prop];
        });
        return baseError;
      }, (v, superJson) => {
        const e = new Error(v.message);
        e.name = v.name;
        e.stack = v.stack;
        superJson.allowedErrorProps.forEach((prop) => {
          e[prop] = v[prop];
        });
        return e;
      }),
      simpleTransformation(isRegExp, "regexp", (v) => "" + v, (regex) => {
        const body = regex.slice(1, regex.lastIndexOf("/"));
        const flags = regex.slice(regex.lastIndexOf("/") + 1);
        return new RegExp(body, flags);
      }),
      simpleTransformation(
        isSet,
        "set",
        // (sets only exist in es6+)
        // eslint-disable-next-line es5/no-es6-methods
        (v) => [...v.values()],
        (v) => new Set(v)
      ),
      simpleTransformation(isMap, "map", (v) => [...v.entries()], (v) => new Map(v)),
      simpleTransformation((v) => isNaNValue(v) || isInfinite(v), "number", (v) => {
        if (isNaNValue(v)) {
          return "NaN";
        }
        if (v > 0) {
          return "Infinity";
        } else {
          return "-Infinity";
        }
      }, Number),
      simpleTransformation((v) => v === 0 && 1 / v === -Infinity, "number", () => {
        return "-0";
      }, Number),
      simpleTransformation(isURL, "URL", (v) => v.toString(), (v) => new URL(v))
    ];
    symbolRule = compositeTransformation((s, superJson) => {
      if (isSymbol(s)) {
        const isRegistered = !!superJson.symbolRegistry.getIdentifier(s);
        return isRegistered;
      }
      return false;
    }, (s, superJson) => {
      const identifier = superJson.symbolRegistry.getIdentifier(s);
      return ["symbol", identifier];
    }, (v) => v.description, (_, a, superJson) => {
      const value = superJson.symbolRegistry.getValue(a[1]);
      if (!value) {
        throw new Error("Trying to deserialize unknown symbol");
      }
      return value;
    });
    constructorToName = [
      Int8Array,
      Uint8Array,
      Int16Array,
      Uint16Array,
      Int32Array,
      Uint32Array,
      Float32Array,
      Float64Array,
      Uint8ClampedArray
    ].reduce((obj, ctor) => {
      obj[ctor.name] = ctor;
      return obj;
    }, {});
    typedArrayRule = compositeTransformation(isTypedArray, (v) => ["typed-array", v.constructor.name], (v) => [...v], (v, a) => {
      const ctor = constructorToName[a[1]];
      if (!ctor) {
        throw new Error("Trying to deserialize unknown typed array");
      }
      return new ctor(v);
    });
    classRule = compositeTransformation(isInstanceOfRegisteredClass, (clazz, superJson) => {
      const identifier = superJson.classRegistry.getIdentifier(clazz.constructor);
      return ["class", identifier];
    }, (clazz, superJson) => {
      const allowedProps = superJson.classRegistry.getAllowedProps(clazz.constructor);
      if (!allowedProps) {
        return { ...clazz };
      }
      const result = {};
      allowedProps.forEach((prop) => {
        result[prop] = clazz[prop];
      });
      return result;
    }, (v, a, superJson) => {
      const clazz = superJson.classRegistry.getValue(a[1]);
      if (!clazz) {
        throw new Error(`Trying to deserialize unknown class '${a[1]}' - check https://github.com/blitz-js/superjson/issues/116#issuecomment-773996564`);
      }
      return Object.assign(Object.create(clazz.prototype), v);
    });
    customRule = compositeTransformation((value, superJson) => {
      return !!superJson.customTransformerRegistry.findApplicable(value);
    }, (value, superJson) => {
      const transformer = superJson.customTransformerRegistry.findApplicable(value);
      return ["custom", transformer.name];
    }, (value, superJson) => {
      const transformer = superJson.customTransformerRegistry.findApplicable(value);
      return transformer.serialize(value);
    }, (v, a, superJson) => {
      const transformer = superJson.customTransformerRegistry.findByName(a[1]);
      if (!transformer) {
        throw new Error("Trying to deserialize unknown custom value");
      }
      return transformer.deserialize(v);
    });
    compositeRules = [classRule, symbolRule, customRule, typedArrayRule];
    transformValue = (value, superJson) => {
      const applicableCompositeRule = findArr(compositeRules, (rule) => rule.isApplicable(value, superJson));
      if (applicableCompositeRule) {
        return {
          value: applicableCompositeRule.transform(value, superJson),
          type: applicableCompositeRule.annotation(value, superJson)
        };
      }
      const applicableSimpleRule = findArr(simpleRules, (rule) => rule.isApplicable(value, superJson));
      if (applicableSimpleRule) {
        return {
          value: applicableSimpleRule.transform(value, superJson),
          type: applicableSimpleRule.annotation
        };
      }
      return void 0;
    };
    simpleRulesByAnnotation = {};
    simpleRules.forEach((rule) => {
      simpleRulesByAnnotation[rule.annotation] = rule;
    });
    untransformValue = (json, type, superJson) => {
      if (isArray(type)) {
        switch (type[0]) {
          case "symbol":
            return symbolRule.untransform(json, type, superJson);
          case "class":
            return classRule.untransform(json, type, superJson);
          case "custom":
            return customRule.untransform(json, type, superJson);
          case "typed-array":
            return typedArrayRule.untransform(json, type, superJson);
          default:
            throw new Error("Unknown transformation: " + type);
        }
      } else {
        const transformation = simpleRulesByAnnotation[type];
        if (!transformation) {
          throw new Error("Unknown transformation: " + type);
        }
        return transformation.untransform(json, superJson);
      }
    };
  }
});

// node_modules/superjson/dist/accessDeep.js
function validatePath(path) {
  if (includes(path, "__proto__")) {
    throw new Error("__proto__ is not allowed as a property");
  }
  if (includes(path, "prototype")) {
    throw new Error("prototype is not allowed as a property");
  }
  if (includes(path, "constructor")) {
    throw new Error("constructor is not allowed as a property");
  }
}
var getNthKey, getDeep, setDeep;
var init_accessDeep = __esm({
  "node_modules/superjson/dist/accessDeep.js"() {
    init_is();
    init_util();
    getNthKey = (value, n) => {
      if (n > value.size)
        throw new Error("index out of bounds");
      const keys = value.keys();
      while (n > 0) {
        keys.next();
        n--;
      }
      return keys.next().value;
    };
    getDeep = (object, path) => {
      validatePath(path);
      for (let i = 0; i < path.length; i++) {
        const key = path[i];
        if (isSet(object)) {
          object = getNthKey(object, +key);
        } else if (isMap(object)) {
          const row = +key;
          const type = +path[++i] === 0 ? "key" : "value";
          const keyOfRow = getNthKey(object, row);
          switch (type) {
            case "key":
              object = keyOfRow;
              break;
            case "value":
              object = object.get(keyOfRow);
              break;
          }
        } else {
          object = object[key];
        }
      }
      return object;
    };
    setDeep = (object, path, mapper) => {
      validatePath(path);
      if (path.length === 0) {
        return mapper(object);
      }
      let parent = object;
      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        if (isArray(parent)) {
          const index = +key;
          parent = parent[index];
        } else if (isPlainObject(parent)) {
          parent = parent[key];
        } else if (isSet(parent)) {
          const row = +key;
          parent = getNthKey(parent, row);
        } else if (isMap(parent)) {
          const isEnd = i === path.length - 2;
          if (isEnd) {
            break;
          }
          const row = +key;
          const type = +path[++i] === 0 ? "key" : "value";
          const keyOfRow = getNthKey(parent, row);
          switch (type) {
            case "key":
              parent = keyOfRow;
              break;
            case "value":
              parent = parent.get(keyOfRow);
              break;
          }
        }
      }
      const lastKey = path[path.length - 1];
      if (isArray(parent)) {
        parent[+lastKey] = mapper(parent[+lastKey]);
      } else if (isPlainObject(parent)) {
        parent[lastKey] = mapper(parent[lastKey]);
      }
      if (isSet(parent)) {
        const oldValue = getNthKey(parent, +lastKey);
        const newValue = mapper(oldValue);
        if (oldValue !== newValue) {
          parent.delete(oldValue);
          parent.add(newValue);
        }
      }
      if (isMap(parent)) {
        const row = +path[path.length - 2];
        const keyToRow = getNthKey(parent, row);
        const type = +lastKey === 0 ? "key" : "value";
        switch (type) {
          case "key": {
            const newKey = mapper(keyToRow);
            parent.set(newKey, parent.get(keyToRow));
            if (newKey !== keyToRow) {
              parent.delete(keyToRow);
            }
            break;
          }
          case "value": {
            parent.set(keyToRow, mapper(parent.get(keyToRow)));
            break;
          }
        }
      }
      return object;
    };
  }
});

// node_modules/superjson/dist/plainer.js
function traverse(tree, walker2, origin = []) {
  if (!tree) {
    return;
  }
  if (!isArray(tree)) {
    forEach(tree, (subtree, key) => traverse(subtree, walker2, [...origin, ...parsePath(key)]));
    return;
  }
  const [nodeValue, children] = tree;
  if (children) {
    forEach(children, (child, key) => {
      traverse(child, walker2, [...origin, ...parsePath(key)]);
    });
  }
  walker2(nodeValue, origin);
}
function applyValueAnnotations(plain, annotations, superJson) {
  traverse(annotations, (type, path) => {
    plain = setDeep(plain, path, (v) => untransformValue(v, type, superJson));
  });
  return plain;
}
function applyReferentialEqualityAnnotations(plain, annotations) {
  function apply(identicalPaths, path) {
    const object = getDeep(plain, parsePath(path));
    identicalPaths.map(parsePath).forEach((identicalObjectPath) => {
      plain = setDeep(plain, identicalObjectPath, () => object);
    });
  }
  if (isArray(annotations)) {
    const [root, other] = annotations;
    root.forEach((identicalPath) => {
      plain = setDeep(plain, parsePath(identicalPath), () => plain);
    });
    if (other) {
      forEach(other, apply);
    }
  } else {
    forEach(annotations, apply);
  }
  return plain;
}
function addIdentity(object, path, identities) {
  const existingSet = identities.get(object);
  if (existingSet) {
    existingSet.push(path);
  } else {
    identities.set(object, [path]);
  }
}
function generateReferentialEqualityAnnotations(identitites, dedupe) {
  const result = {};
  let rootEqualityPaths = void 0;
  identitites.forEach((paths) => {
    if (paths.length <= 1) {
      return;
    }
    if (!dedupe) {
      paths = paths.map((path) => path.map(String)).sort((a, b) => a.length - b.length);
    }
    const [representativePath, ...identicalPaths] = paths;
    if (representativePath.length === 0) {
      rootEqualityPaths = identicalPaths.map(stringifyPath);
    } else {
      result[stringifyPath(representativePath)] = identicalPaths.map(stringifyPath);
    }
  });
  if (rootEqualityPaths) {
    if (isEmptyObject(result)) {
      return [rootEqualityPaths];
    } else {
      return [rootEqualityPaths, result];
    }
  } else {
    return isEmptyObject(result) ? void 0 : result;
  }
}
var isDeep, walker;
var init_plainer = __esm({
  "node_modules/superjson/dist/plainer.js"() {
    init_is();
    init_pathstringifier();
    init_transformer();
    init_util();
    init_pathstringifier();
    init_accessDeep();
    isDeep = (object, superJson) => isPlainObject(object) || isArray(object) || isMap(object) || isSet(object) || isInstanceOfRegisteredClass(object, superJson);
    walker = (object, identities, superJson, dedupe, path = [], objectsInThisPath = [], seenObjects = /* @__PURE__ */ new Map()) => {
      const primitive = isPrimitive(object);
      if (!primitive) {
        addIdentity(object, path, identities);
        const seen = seenObjects.get(object);
        if (seen) {
          return dedupe ? {
            transformedValue: null
          } : seen;
        }
      }
      if (!isDeep(object, superJson)) {
        const transformed2 = transformValue(object, superJson);
        const result2 = transformed2 ? {
          transformedValue: transformed2.value,
          annotations: [transformed2.type]
        } : {
          transformedValue: object
        };
        if (!primitive) {
          seenObjects.set(object, result2);
        }
        return result2;
      }
      if (includes(objectsInThisPath, object)) {
        return {
          transformedValue: null
        };
      }
      const transformationResult = transformValue(object, superJson);
      const transformed = transformationResult?.value ?? object;
      const transformedValue = isArray(transformed) ? [] : {};
      const innerAnnotations = {};
      forEach(transformed, (value, index) => {
        if (index === "__proto__" || index === "constructor" || index === "prototype") {
          throw new Error(`Detected property ${index}. This is a prototype pollution risk, please remove it from your object.`);
        }
        const recursiveResult = walker(value, identities, superJson, dedupe, [...path, index], [...objectsInThisPath, object], seenObjects);
        transformedValue[index] = recursiveResult.transformedValue;
        if (isArray(recursiveResult.annotations)) {
          innerAnnotations[index] = recursiveResult.annotations;
        } else if (isPlainObject(recursiveResult.annotations)) {
          forEach(recursiveResult.annotations, (tree, key) => {
            innerAnnotations[escapeKey(index) + "." + key] = tree;
          });
        }
      });
      const result = isEmptyObject(innerAnnotations) ? {
        transformedValue,
        annotations: !!transformationResult ? [transformationResult.type] : void 0
      } : {
        transformedValue,
        annotations: !!transformationResult ? [transformationResult.type, innerAnnotations] : innerAnnotations
      };
      if (!primitive) {
        seenObjects.set(object, result);
      }
      return result;
    };
  }
});

// node_modules/is-what/dist/index.js
function getType2(payload) {
  return Object.prototype.toString.call(payload).slice(8, -1);
}
function isArray2(payload) {
  return getType2(payload) === "Array";
}
function isPlainObject2(payload) {
  if (getType2(payload) !== "Object")
    return false;
  const prototype = Object.getPrototypeOf(payload);
  return !!prototype && prototype.constructor === Object && prototype === Object.prototype;
}
function isNull2(payload) {
  return getType2(payload) === "Null";
}
function isOneOf(a, b, c, d, e) {
  return (value) => a(value) || b(value) || !!c && c(value) || !!d && d(value) || !!e && e(value);
}
function isUndefined2(payload) {
  return getType2(payload) === "Undefined";
}
var isNullOrUndefined;
var init_dist = __esm({
  "node_modules/is-what/dist/index.js"() {
    isNullOrUndefined = isOneOf(isNull2, isUndefined2);
  }
});

// node_modules/copy-anything/dist/index.js
function assignProp(carry, key, newVal, originalObject, includeNonenumerable) {
  const propType = {}.propertyIsEnumerable.call(originalObject, key) ? "enumerable" : "nonenumerable";
  if (propType === "enumerable")
    carry[key] = newVal;
  if (includeNonenumerable && propType === "nonenumerable") {
    Object.defineProperty(carry, key, {
      value: newVal,
      enumerable: false,
      writable: true,
      configurable: true
    });
  }
}
function copy(target, options = {}) {
  if (isArray2(target)) {
    return target.map((item) => copy(item, options));
  }
  if (!isPlainObject2(target)) {
    return target;
  }
  const props = Object.getOwnPropertyNames(target);
  const symbols = Object.getOwnPropertySymbols(target);
  return [...props, ...symbols].reduce((carry, key) => {
    if (isArray2(options.props) && !options.props.includes(key)) {
      return carry;
    }
    const val = target[key];
    const newVal = copy(val, options);
    assignProp(carry, key, newVal, target, options.nonenumerable);
    return carry;
  }, {});
}
var init_dist2 = __esm({
  "node_modules/copy-anything/dist/index.js"() {
    init_dist();
  }
});

// node_modules/superjson/dist/index.js
var SuperJSON, serialize, deserialize, stringify, parse, registerClass, registerCustom, registerSymbol, allowErrorProps;
var init_dist3 = __esm({
  "node_modules/superjson/dist/index.js"() {
    init_class_registry();
    init_registry();
    init_custom_transformer_registry();
    init_plainer();
    init_dist2();
    SuperJSON = class {
      /**
       * @param dedupeReferentialEqualities  If true, SuperJSON will make sure only one instance of referentially equal objects are serialized and the rest are replaced with `null`.
       */
      constructor({ dedupe = false } = {}) {
        this.classRegistry = new ClassRegistry();
        this.symbolRegistry = new Registry((s) => s.description ?? "");
        this.customTransformerRegistry = new CustomTransformerRegistry();
        this.allowedErrorProps = [];
        this.dedupe = dedupe;
      }
      serialize(object) {
        const identities = /* @__PURE__ */ new Map();
        const output = walker(object, identities, this, this.dedupe);
        const res = {
          json: output.transformedValue
        };
        if (output.annotations) {
          res.meta = {
            ...res.meta,
            values: output.annotations
          };
        }
        const equalityAnnotations = generateReferentialEqualityAnnotations(identities, this.dedupe);
        if (equalityAnnotations) {
          res.meta = {
            ...res.meta,
            referentialEqualities: equalityAnnotations
          };
        }
        return res;
      }
      deserialize(payload) {
        const { json, meta } = payload;
        let result = copy(json);
        if (meta?.values) {
          result = applyValueAnnotations(result, meta.values, this);
        }
        if (meta?.referentialEqualities) {
          result = applyReferentialEqualityAnnotations(result, meta.referentialEqualities);
        }
        return result;
      }
      stringify(object) {
        return JSON.stringify(this.serialize(object));
      }
      parse(string) {
        return this.deserialize(JSON.parse(string));
      }
      registerClass(v, options) {
        this.classRegistry.register(v, options);
      }
      registerSymbol(v, identifier) {
        this.symbolRegistry.register(v, identifier);
      }
      registerCustom(transformer, name) {
        this.customTransformerRegistry.register({
          name,
          ...transformer
        });
      }
      allowErrorProps(...props) {
        this.allowedErrorProps.push(...props);
      }
    };
    SuperJSON.defaultInstance = new SuperJSON();
    SuperJSON.serialize = SuperJSON.defaultInstance.serialize.bind(SuperJSON.defaultInstance);
    SuperJSON.deserialize = SuperJSON.defaultInstance.deserialize.bind(SuperJSON.defaultInstance);
    SuperJSON.stringify = SuperJSON.defaultInstance.stringify.bind(SuperJSON.defaultInstance);
    SuperJSON.parse = SuperJSON.defaultInstance.parse.bind(SuperJSON.defaultInstance);
    SuperJSON.registerClass = SuperJSON.defaultInstance.registerClass.bind(SuperJSON.defaultInstance);
    SuperJSON.registerSymbol = SuperJSON.defaultInstance.registerSymbol.bind(SuperJSON.defaultInstance);
    SuperJSON.registerCustom = SuperJSON.defaultInstance.registerCustom.bind(SuperJSON.defaultInstance);
    SuperJSON.allowErrorProps = SuperJSON.defaultInstance.allowErrorProps.bind(SuperJSON.defaultInstance);
    serialize = SuperJSON.serialize;
    deserialize = SuperJSON.deserialize;
    stringify = SuperJSON.stringify;
    parse = SuperJSON.parse;
    registerClass = SuperJSON.registerClass;
    registerCustom = SuperJSON.registerCustom;
    registerSymbol = SuperJSON.registerSymbol;
    allowErrorProps = SuperJSON.allowErrorProps;
  }
});

// node_modules/kysely/dist/esm/util/object-utils.js
function isUndefined3(obj) {
  return typeof obj === "undefined" || obj === void 0;
}
function isString2(obj) {
  return typeof obj === "string";
}
function isNumber2(obj) {
  return typeof obj === "number";
}
function isBoolean2(obj) {
  return typeof obj === "boolean";
}
function isNull3(obj) {
  return obj === null;
}
function isDate2(obj) {
  return obj instanceof Date;
}
function isBigInt(obj) {
  return typeof obj === "bigint";
}
function isBuffer(obj) {
  return typeof Buffer !== "undefined" && Buffer.isBuffer(obj);
}
function isFunction(obj) {
  return typeof obj === "function";
}
function isObject(obj) {
  return typeof obj === "object" && obj !== null;
}
function isArrayBufferOrView(obj) {
  return obj instanceof ArrayBuffer || ArrayBuffer.isView(obj);
}
function isPlainObject3(obj) {
  return isObject(obj) && !Array.isArray(obj) && !isDate2(obj) && !isBuffer(obj) && !isArrayBufferOrView(obj);
}
function freeze(obj) {
  return Object.freeze(obj);
}
function isReadonlyArray(arg) {
  return Array.isArray(arg);
}
function noop(obj) {
  return obj;
}
var init_object_utils = __esm({
  "node_modules/kysely/dist/esm/util/object-utils.js"() {
  }
});

// node_modules/kysely/dist/esm/operation-node/alter-table-node.js
var AlterTableNode;
var init_alter_table_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/alter-table-node.js"() {
    init_object_utils();
    AlterTableNode = freeze({
      is(node) {
        return node.kind === "AlterTableNode";
      },
      create(table) {
        return freeze({
          kind: "AlterTableNode",
          table
        });
      },
      cloneWithTableProps(node, props) {
        return freeze({
          ...node,
          ...props
        });
      },
      cloneWithColumnAlteration(node, columnAlteration) {
        return freeze({
          ...node,
          columnAlterations: node.columnAlterations ? [...node.columnAlterations, columnAlteration] : [columnAlteration]
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/identifier-node.js
var IdentifierNode;
var init_identifier_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/identifier-node.js"() {
    init_object_utils();
    IdentifierNode = freeze({
      is(node) {
        return node.kind === "IdentifierNode";
      },
      create(name) {
        return freeze({
          kind: "IdentifierNode",
          name
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/create-index-node.js
var CreateIndexNode;
var init_create_index_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/create-index-node.js"() {
    init_object_utils();
    init_identifier_node();
    CreateIndexNode = freeze({
      is(node) {
        return node.kind === "CreateIndexNode";
      },
      create(name) {
        return freeze({
          kind: "CreateIndexNode",
          name: IdentifierNode.create(name)
        });
      },
      cloneWith(node, props) {
        return freeze({
          ...node,
          ...props
        });
      },
      cloneWithColumns(node, columns) {
        return freeze({
          ...node,
          columns: [...node.columns || [], ...columns]
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/create-schema-node.js
var CreateSchemaNode;
var init_create_schema_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/create-schema-node.js"() {
    init_object_utils();
    init_identifier_node();
    CreateSchemaNode = freeze({
      is(node) {
        return node.kind === "CreateSchemaNode";
      },
      create(schema9, params) {
        return freeze({
          kind: "CreateSchemaNode",
          schema: IdentifierNode.create(schema9),
          ...params
        });
      },
      cloneWith(createSchema, params) {
        return freeze({
          ...createSchema,
          ...params
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/create-table-node.js
var ON_COMMIT_ACTIONS, CreateTableNode;
var init_create_table_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/create-table-node.js"() {
    init_object_utils();
    ON_COMMIT_ACTIONS = ["preserve rows", "delete rows", "drop"];
    CreateTableNode = freeze({
      is(node) {
        return node.kind === "CreateTableNode";
      },
      create(table) {
        return freeze({
          kind: "CreateTableNode",
          table,
          columns: freeze([])
        });
      },
      cloneWithColumn(createTable, column) {
        return freeze({
          ...createTable,
          columns: freeze([...createTable.columns, column])
        });
      },
      cloneWithConstraint(createTable, constraint) {
        return freeze({
          ...createTable,
          constraints: createTable.constraints ? freeze([...createTable.constraints, constraint]) : freeze([constraint])
        });
      },
      cloneWithFrontModifier(createTable, modifier) {
        return freeze({
          ...createTable,
          frontModifiers: createTable.frontModifiers ? freeze([...createTable.frontModifiers, modifier]) : freeze([modifier])
        });
      },
      cloneWithEndModifier(createTable, modifier) {
        return freeze({
          ...createTable,
          endModifiers: createTable.endModifiers ? freeze([...createTable.endModifiers, modifier]) : freeze([modifier])
        });
      },
      cloneWith(createTable, params) {
        return freeze({
          ...createTable,
          ...params
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/schemable-identifier-node.js
var SchemableIdentifierNode;
var init_schemable_identifier_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/schemable-identifier-node.js"() {
    init_object_utils();
    init_identifier_node();
    SchemableIdentifierNode = freeze({
      is(node) {
        return node.kind === "SchemableIdentifierNode";
      },
      create(identifier) {
        return freeze({
          kind: "SchemableIdentifierNode",
          identifier: IdentifierNode.create(identifier)
        });
      },
      createWithSchema(schema9, identifier) {
        return freeze({
          kind: "SchemableIdentifierNode",
          schema: IdentifierNode.create(schema9),
          identifier: IdentifierNode.create(identifier)
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/drop-index-node.js
var DropIndexNode;
var init_drop_index_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/drop-index-node.js"() {
    init_object_utils();
    init_schemable_identifier_node();
    DropIndexNode = freeze({
      is(node) {
        return node.kind === "DropIndexNode";
      },
      create(name, params) {
        return freeze({
          kind: "DropIndexNode",
          name: SchemableIdentifierNode.create(name),
          ...params
        });
      },
      cloneWith(dropIndex, props) {
        return freeze({
          ...dropIndex,
          ...props
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/drop-schema-node.js
var DropSchemaNode;
var init_drop_schema_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/drop-schema-node.js"() {
    init_object_utils();
    init_identifier_node();
    DropSchemaNode = freeze({
      is(node) {
        return node.kind === "DropSchemaNode";
      },
      create(schema9, params) {
        return freeze({
          kind: "DropSchemaNode",
          schema: IdentifierNode.create(schema9),
          ...params
        });
      },
      cloneWith(dropSchema, params) {
        return freeze({
          ...dropSchema,
          ...params
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/drop-table-node.js
var DropTableNode;
var init_drop_table_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/drop-table-node.js"() {
    init_object_utils();
    DropTableNode = freeze({
      is(node) {
        return node.kind === "DropTableNode";
      },
      create(table, params) {
        return freeze({
          kind: "DropTableNode",
          table,
          ...params
        });
      },
      cloneWith(dropIndex, params) {
        return freeze({
          ...dropIndex,
          ...params
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/alias-node.js
var AliasNode;
var init_alias_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/alias-node.js"() {
    init_object_utils();
    AliasNode = freeze({
      is(node) {
        return node.kind === "AliasNode";
      },
      create(node, alias) {
        return freeze({
          kind: "AliasNode",
          node,
          alias
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/table-node.js
var TableNode;
var init_table_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/table-node.js"() {
    init_object_utils();
    init_schemable_identifier_node();
    TableNode = freeze({
      is(node) {
        return node.kind === "TableNode";
      },
      create(table) {
        return freeze({
          kind: "TableNode",
          table: SchemableIdentifierNode.create(table)
        });
      },
      createWithSchema(schema9, table) {
        return freeze({
          kind: "TableNode",
          table: SchemableIdentifierNode.createWithSchema(schema9, table)
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/operation-node-source.js
function isOperationNodeSource(obj) {
  return isObject(obj) && isFunction(obj.toOperationNode);
}
var init_operation_node_source = __esm({
  "node_modules/kysely/dist/esm/operation-node/operation-node-source.js"() {
    init_object_utils();
  }
});

// node_modules/kysely/dist/esm/expression/expression.js
function isExpression(obj) {
  return isObject(obj) && "expressionType" in obj && isOperationNodeSource(obj);
}
function isAliasedExpression(obj) {
  return isObject(obj) && "expression" in obj && isString2(obj.alias) && isOperationNodeSource(obj);
}
var init_expression = __esm({
  "node_modules/kysely/dist/esm/expression/expression.js"() {
    init_operation_node_source();
    init_object_utils();
  }
});

// node_modules/kysely/dist/esm/operation-node/select-modifier-node.js
var SelectModifierNode;
var init_select_modifier_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/select-modifier-node.js"() {
    init_object_utils();
    SelectModifierNode = freeze({
      is(node) {
        return node.kind === "SelectModifierNode";
      },
      create(modifier) {
        return freeze({
          kind: "SelectModifierNode",
          modifier
        });
      },
      createWithExpression(modifier) {
        return freeze({
          kind: "SelectModifierNode",
          rawModifier: modifier
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/and-node.js
var AndNode;
var init_and_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/and-node.js"() {
    init_object_utils();
    AndNode = freeze({
      is(node) {
        return node.kind === "AndNode";
      },
      create(left, right) {
        return freeze({
          kind: "AndNode",
          left,
          right
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/or-node.js
var OrNode;
var init_or_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/or-node.js"() {
    init_object_utils();
    OrNode = freeze({
      is(node) {
        return node.kind === "OrNode";
      },
      create(left, right) {
        return freeze({
          kind: "OrNode",
          left,
          right
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/on-node.js
var OnNode;
var init_on_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/on-node.js"() {
    init_object_utils();
    init_and_node();
    init_or_node();
    OnNode = freeze({
      is(node) {
        return node.kind === "OnNode";
      },
      create(filter) {
        return freeze({
          kind: "OnNode",
          on: filter
        });
      },
      cloneWithOperation(onNode, operator, operation) {
        return freeze({
          ...onNode,
          on: operator === "And" ? AndNode.create(onNode.on, operation) : OrNode.create(onNode.on, operation)
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/join-node.js
var JoinNode;
var init_join_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/join-node.js"() {
    init_object_utils();
    init_on_node();
    JoinNode = freeze({
      is(node) {
        return node.kind === "JoinNode";
      },
      create(joinType, table) {
        return freeze({
          kind: "JoinNode",
          joinType,
          table,
          on: void 0
        });
      },
      createWithOn(joinType, table, on) {
        return freeze({
          kind: "JoinNode",
          joinType,
          table,
          on: OnNode.create(on)
        });
      },
      cloneWithOn(joinNode, operation) {
        return freeze({
          ...joinNode,
          on: joinNode.on ? OnNode.cloneWithOperation(joinNode.on, "And", operation) : OnNode.create(operation)
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/binary-operation-node.js
var BinaryOperationNode;
var init_binary_operation_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/binary-operation-node.js"() {
    init_object_utils();
    BinaryOperationNode = freeze({
      is(node) {
        return node.kind === "BinaryOperationNode";
      },
      create(leftOperand, operator, rightOperand) {
        return freeze({
          kind: "BinaryOperationNode",
          leftOperand,
          operator,
          rightOperand
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/operator-node.js
function isJSONOperator(op) {
  return isString2(op) && JSON_OPERATORS.includes(op);
}
var COMPARISON_OPERATORS, ARITHMETIC_OPERATORS, JSON_OPERATORS, BINARY_OPERATORS, UNARY_FILTER_OPERATORS, UNARY_OPERATORS, OPERATORS, OperatorNode;
var init_operator_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/operator-node.js"() {
    init_object_utils();
    COMPARISON_OPERATORS = [
      "=",
      "==",
      "!=",
      "<>",
      ">",
      ">=",
      "<",
      "<=",
      "in",
      "not in",
      "is",
      "is not",
      "like",
      "not like",
      "match",
      "ilike",
      "not ilike",
      "@>",
      "<@",
      "&&",
      "?",
      "?&",
      "!<",
      "!>",
      "<=>",
      "!~",
      "~",
      "~*",
      "!~*",
      "@@",
      "@@@",
      "!!",
      "<->",
      "regexp"
    ];
    ARITHMETIC_OPERATORS = [
      "+",
      "-",
      "*",
      "/",
      "%",
      "^",
      "&",
      "|",
      "#",
      "<<",
      ">>"
    ];
    JSON_OPERATORS = ["->", "->>"];
    BINARY_OPERATORS = [
      ...COMPARISON_OPERATORS,
      ...ARITHMETIC_OPERATORS,
      "&&",
      "||"
    ];
    UNARY_FILTER_OPERATORS = ["exists", "not exists"];
    UNARY_OPERATORS = ["not", "-", ...UNARY_FILTER_OPERATORS];
    OPERATORS = [
      ...BINARY_OPERATORS,
      ...JSON_OPERATORS,
      ...UNARY_OPERATORS,
      "between",
      "between symmetric"
    ];
    OperatorNode = freeze({
      is(node) {
        return node.kind === "OperatorNode";
      },
      create(operator) {
        return freeze({
          kind: "OperatorNode",
          operator
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/column-node.js
var ColumnNode;
var init_column_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/column-node.js"() {
    init_object_utils();
    init_identifier_node();
    ColumnNode = freeze({
      is(node) {
        return node.kind === "ColumnNode";
      },
      create(column) {
        return freeze({
          kind: "ColumnNode",
          column: IdentifierNode.create(column)
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/select-all-node.js
var SelectAllNode;
var init_select_all_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/select-all-node.js"() {
    init_object_utils();
    SelectAllNode = freeze({
      is(node) {
        return node.kind === "SelectAllNode";
      },
      create() {
        return freeze({
          kind: "SelectAllNode"
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/reference-node.js
var ReferenceNode;
var init_reference_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/reference-node.js"() {
    init_select_all_node();
    init_object_utils();
    ReferenceNode = freeze({
      is(node) {
        return node.kind === "ReferenceNode";
      },
      create(column, table) {
        return freeze({
          kind: "ReferenceNode",
          table,
          column
        });
      },
      createSelectAll(table) {
        return freeze({
          kind: "ReferenceNode",
          table,
          column: SelectAllNode.create()
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/dynamic/dynamic-reference-builder.js
function isDynamicReferenceBuilder(obj) {
  return isObject(obj) && isOperationNodeSource(obj) && isString2(obj.dynamicReference);
}
var DynamicReferenceBuilder;
var init_dynamic_reference_builder = __esm({
  "node_modules/kysely/dist/esm/dynamic/dynamic-reference-builder.js"() {
    init_operation_node_source();
    init_reference_parser();
    init_object_utils();
    DynamicReferenceBuilder = class {
      #dynamicReference;
      get dynamicReference() {
        return this.#dynamicReference;
      }
      /**
       * @private
       *
       * This needs to be here just so that the typings work. Without this
       * the generated .d.ts file contains no reference to the type param R
       * which causes this type to be equal to DynamicReferenceBuilder with
       * any R.
       */
      get refType() {
        return void 0;
      }
      constructor(reference) {
        this.#dynamicReference = reference;
      }
      toOperationNode() {
        return parseSimpleReferenceExpression(this.#dynamicReference);
      }
    };
  }
});

// node_modules/kysely/dist/esm/operation-node/order-by-item-node.js
var OrderByItemNode;
var init_order_by_item_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/order-by-item-node.js"() {
    init_object_utils();
    OrderByItemNode = freeze({
      is(node) {
        return node.kind === "OrderByItemNode";
      },
      create(orderBy, direction) {
        return freeze({
          kind: "OrderByItemNode",
          orderBy,
          direction
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/raw-node.js
var RawNode;
var init_raw_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/raw-node.js"() {
    init_object_utils();
    RawNode = freeze({
      is(node) {
        return node.kind === "RawNode";
      },
      create(sqlFragments, parameters) {
        return freeze({
          kind: "RawNode",
          sqlFragments: freeze(sqlFragments),
          parameters: freeze(parameters)
        });
      },
      createWithSql(sql2) {
        return RawNode.create([sql2], []);
      },
      createWithChild(child) {
        return RawNode.create(["", ""], [child]);
      },
      createWithChildren(children) {
        return RawNode.create(new Array(children.length + 1).fill(""), children);
      }
    });
  }
});

// node_modules/kysely/dist/esm/parser/order-by-parser.js
function isOrderByDirection(thing) {
  return thing === "asc" || thing === "desc";
}
function parseOrderBy(args) {
  if (args.length === 2) {
    return [parseOrderByItem(args[0], args[1])];
  }
  if (args.length === 1) {
    const [orderBy] = args;
    if (Array.isArray(orderBy)) {
      return orderBy.map((item) => parseOrderByItem(item));
    }
    return [parseOrderByItem(orderBy)];
  }
  throw new Error(`Invalid number of arguments at order by! expected 1-2, received ${args.length}`);
}
function parseOrderByItem(ref, direction) {
  const parsedRef = parseOrderByExpression(ref);
  if (OrderByItemNode.is(parsedRef)) {
    if (direction) {
      throw new Error("Cannot specify direction twice!");
    }
    return parsedRef;
  }
  return OrderByItemNode.create(parsedRef, parseOrderByDirectionExpression(direction));
}
function parseOrderByExpression(expr) {
  if (isExpressionOrFactory(expr)) {
    return parseExpression(expr);
  }
  if (isDynamicReferenceBuilder(expr)) {
    return expr.toOperationNode();
  }
  const [ref, direction] = expr.split(" ");
  if (direction) {
    if (!isOrderByDirection(direction)) {
      throw new Error(`Invalid order by direction: ${direction}`);
    }
    return OrderByItemNode.create(parseStringReference(ref), parseOrderByDirectionExpression(direction));
  }
  return parseStringReference(expr);
}
function parseOrderByDirectionExpression(expr) {
  if (!expr) {
    return void 0;
  }
  if (expr === "asc" || expr === "desc") {
    return RawNode.createWithSql(expr);
  }
  return expr.toOperationNode();
}
var init_order_by_parser = __esm({
  "node_modules/kysely/dist/esm/parser/order-by-parser.js"() {
    init_dynamic_reference_builder();
    init_order_by_item_node();
    init_raw_node();
    init_expression_parser();
    init_reference_parser();
  }
});

// node_modules/kysely/dist/esm/operation-node/json-reference-node.js
var JSONReferenceNode;
var init_json_reference_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/json-reference-node.js"() {
    init_object_utils();
    JSONReferenceNode = freeze({
      is(node) {
        return node.kind === "JSONReferenceNode";
      },
      create(reference, traversal) {
        return freeze({
          kind: "JSONReferenceNode",
          reference,
          traversal
        });
      },
      cloneWithTraversal(node, traversal) {
        return freeze({
          ...node,
          traversal
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/json-operator-chain-node.js
var JSONOperatorChainNode;
var init_json_operator_chain_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/json-operator-chain-node.js"() {
    init_object_utils();
    JSONOperatorChainNode = freeze({
      is(node) {
        return node.kind === "JSONOperatorChainNode";
      },
      create(operator) {
        return freeze({
          kind: "JSONOperatorChainNode",
          operator,
          values: freeze([])
        });
      },
      cloneWithValue(node, value) {
        return freeze({
          ...node,
          values: freeze([...node.values, value])
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/json-path-node.js
var JSONPathNode;
var init_json_path_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/json-path-node.js"() {
    init_object_utils();
    JSONPathNode = freeze({
      is(node) {
        return node.kind === "JSONPathNode";
      },
      create(inOperator) {
        return freeze({
          kind: "JSONPathNode",
          inOperator,
          pathLegs: freeze([])
        });
      },
      cloneWithLeg(jsonPathNode, pathLeg) {
        return freeze({
          ...jsonPathNode,
          pathLegs: freeze([...jsonPathNode.pathLegs, pathLeg])
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/parser/reference-parser.js
function parseSimpleReferenceExpression(exp) {
  if (isString2(exp)) {
    return parseStringReference(exp);
  }
  return exp.toOperationNode();
}
function parseReferenceExpressionOrList(arg) {
  if (isReadonlyArray(arg)) {
    return arg.map((it) => parseReferenceExpression(it));
  } else {
    return [parseReferenceExpression(arg)];
  }
}
function parseReferenceExpression(exp) {
  if (isExpressionOrFactory(exp)) {
    return parseExpression(exp);
  }
  return parseSimpleReferenceExpression(exp);
}
function parseJSONReference(ref, op) {
  const referenceNode = parseStringReference(ref);
  if (isJSONOperator(op)) {
    return JSONReferenceNode.create(referenceNode, JSONOperatorChainNode.create(OperatorNode.create(op)));
  }
  const opWithoutLastChar = op.slice(0, -1);
  if (isJSONOperator(opWithoutLastChar)) {
    return JSONReferenceNode.create(referenceNode, JSONPathNode.create(OperatorNode.create(opWithoutLastChar)));
  }
  throw new Error(`Invalid JSON operator: ${op}`);
}
function parseStringReference(ref) {
  const COLUMN_SEPARATOR = ".";
  if (!ref.includes(COLUMN_SEPARATOR)) {
    return ReferenceNode.create(ColumnNode.create(ref));
  }
  const parts = ref.split(COLUMN_SEPARATOR).map(trim);
  if (parts.length === 3) {
    return parseStringReferenceWithTableAndSchema(parts);
  }
  if (parts.length === 2) {
    return parseStringReferenceWithTable(parts);
  }
  throw new Error(`invalid column reference ${ref}`);
}
function parseAliasedStringReference(ref) {
  const ALIAS_SEPARATOR = " as ";
  if (ref.includes(ALIAS_SEPARATOR)) {
    const [columnRef, alias] = ref.split(ALIAS_SEPARATOR).map(trim);
    return AliasNode.create(parseStringReference(columnRef), IdentifierNode.create(alias));
  } else {
    return parseStringReference(ref);
  }
}
function parseColumnName(column) {
  return ColumnNode.create(column);
}
function parseOrderedColumnName(column) {
  const ORDER_SEPARATOR = " ";
  if (column.includes(ORDER_SEPARATOR)) {
    const [columnName, order] = column.split(ORDER_SEPARATOR).map(trim);
    if (!isOrderByDirection(order)) {
      throw new Error(`invalid order direction "${order}" next to "${columnName}"`);
    }
    return parseOrderBy([columnName, order])[0];
  } else {
    return parseColumnName(column);
  }
}
function parseStringReferenceWithTableAndSchema(parts) {
  const [schema9, table, column] = parts;
  return ReferenceNode.create(ColumnNode.create(column), TableNode.createWithSchema(schema9, table));
}
function parseStringReferenceWithTable(parts) {
  const [table, column] = parts;
  return ReferenceNode.create(ColumnNode.create(column), TableNode.create(table));
}
function trim(str) {
  return str.trim();
}
var init_reference_parser = __esm({
  "node_modules/kysely/dist/esm/parser/reference-parser.js"() {
    init_alias_node();
    init_column_node();
    init_reference_node();
    init_table_node();
    init_object_utils();
    init_expression_parser();
    init_identifier_node();
    init_order_by_parser();
    init_operator_node();
    init_json_reference_node();
    init_json_operator_chain_node();
    init_json_path_node();
  }
});

// node_modules/kysely/dist/esm/operation-node/primitive-value-list-node.js
var PrimitiveValueListNode;
var init_primitive_value_list_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/primitive-value-list-node.js"() {
    init_object_utils();
    PrimitiveValueListNode = freeze({
      is(node) {
        return node.kind === "PrimitiveValueListNode";
      },
      create(values) {
        return freeze({
          kind: "PrimitiveValueListNode",
          values: freeze([...values])
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/value-list-node.js
var ValueListNode;
var init_value_list_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/value-list-node.js"() {
    init_object_utils();
    ValueListNode = freeze({
      is(node) {
        return node.kind === "ValueListNode";
      },
      create(values) {
        return freeze({
          kind: "ValueListNode",
          values: freeze(values)
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/value-node.js
var ValueNode;
var init_value_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/value-node.js"() {
    init_object_utils();
    ValueNode = freeze({
      is(node) {
        return node.kind === "ValueNode";
      },
      create(value) {
        return freeze({
          kind: "ValueNode",
          value
        });
      },
      createImmediate(value) {
        return freeze({
          kind: "ValueNode",
          value,
          immediate: true
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/parser/value-parser.js
function parseValueExpressionOrList(arg) {
  if (isReadonlyArray(arg)) {
    return parseValueExpressionList(arg);
  }
  return parseValueExpression(arg);
}
function parseValueExpression(exp) {
  if (isExpressionOrFactory(exp)) {
    return parseExpression(exp);
  }
  return ValueNode.create(exp);
}
function isSafeImmediateValue(value) {
  return isNumber2(value) || isBoolean2(value) || isNull3(value);
}
function parseSafeImmediateValue(value) {
  if (!isSafeImmediateValue(value)) {
    throw new Error(`unsafe immediate value ${JSON.stringify(value)}`);
  }
  return ValueNode.createImmediate(value);
}
function parseValueExpressionList(arg) {
  if (arg.some(isExpressionOrFactory)) {
    return ValueListNode.create(arg.map((it) => parseValueExpression(it)));
  }
  return PrimitiveValueListNode.create(arg);
}
var init_value_parser = __esm({
  "node_modules/kysely/dist/esm/parser/value-parser.js"() {
    init_primitive_value_list_node();
    init_value_list_node();
    init_value_node();
    init_object_utils();
    init_expression_parser();
  }
});

// node_modules/kysely/dist/esm/operation-node/parens-node.js
var ParensNode;
var init_parens_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/parens-node.js"() {
    init_object_utils();
    ParensNode = freeze({
      is(node) {
        return node.kind === "ParensNode";
      },
      create(node) {
        return freeze({
          kind: "ParensNode",
          node
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/parser/binary-operation-parser.js
function parseValueBinaryOperationOrExpression(args) {
  if (args.length === 3) {
    return parseValueBinaryOperation(args[0], args[1], args[2]);
  } else if (args.length === 1) {
    return parseValueExpression(args[0]);
  }
  throw new Error(`invalid arguments: ${JSON.stringify(args)}`);
}
function parseValueBinaryOperation(left, operator, right) {
  if (isIsOperator(operator) && needsIsOperator(right)) {
    return BinaryOperationNode.create(parseReferenceExpression(left), parseOperator(operator), ValueNode.createImmediate(right));
  }
  return BinaryOperationNode.create(parseReferenceExpression(left), parseOperator(operator), parseValueExpressionOrList(right));
}
function parseReferentialBinaryOperation(left, operator, right) {
  return BinaryOperationNode.create(parseReferenceExpression(left), parseOperator(operator), parseReferenceExpression(right));
}
function parseFilterObject(obj, combinator) {
  return parseFilterList(Object.entries(obj).filter(([, v]) => !isUndefined3(v)).map(([k, v]) => parseValueBinaryOperation(k, needsIsOperator(v) ? "is" : "=", v)), combinator);
}
function parseFilterList(list, combinator) {
  const combine = combinator === "and" ? AndNode.create : OrNode.create;
  if (list.length === 0) {
    return ValueNode.createImmediate(combinator === "and");
  }
  let node = toOperationNode(list[0]);
  for (let i = 1; i < list.length; ++i) {
    node = combine(node, toOperationNode(list[i]));
  }
  if (list.length > 1) {
    return ParensNode.create(node);
  }
  return node;
}
function isIsOperator(operator) {
  return operator === "is" || operator === "is not";
}
function needsIsOperator(value) {
  return isNull3(value) || isBoolean2(value);
}
function parseOperator(operator) {
  if (isString2(operator) && OPERATORS.includes(operator)) {
    return OperatorNode.create(operator);
  }
  if (isOperationNodeSource(operator)) {
    return operator.toOperationNode();
  }
  throw new Error(`invalid operator ${JSON.stringify(operator)}`);
}
function toOperationNode(nodeOrSource) {
  return isOperationNodeSource(nodeOrSource) ? nodeOrSource.toOperationNode() : nodeOrSource;
}
var init_binary_operation_parser = __esm({
  "node_modules/kysely/dist/esm/parser/binary-operation-parser.js"() {
    init_binary_operation_node();
    init_object_utils();
    init_operation_node_source();
    init_operator_node();
    init_reference_parser();
    init_value_parser();
    init_value_node();
    init_and_node();
    init_parens_node();
    init_or_node();
  }
});

// node_modules/kysely/dist/esm/operation-node/order-by-node.js
var OrderByNode;
var init_order_by_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/order-by-node.js"() {
    init_object_utils();
    OrderByNode = freeze({
      is(node) {
        return node.kind === "OrderByNode";
      },
      create(items) {
        return freeze({
          kind: "OrderByNode",
          items: freeze([...items])
        });
      },
      cloneWithItems(orderBy, items) {
        return freeze({
          ...orderBy,
          items: freeze([...orderBy.items, ...items])
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/partition-by-node.js
var PartitionByNode;
var init_partition_by_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/partition-by-node.js"() {
    init_object_utils();
    PartitionByNode = freeze({
      is(node) {
        return node.kind === "PartitionByNode";
      },
      create(items) {
        return freeze({
          kind: "PartitionByNode",
          items: freeze(items)
        });
      },
      cloneWithItems(partitionBy, items) {
        return freeze({
          ...partitionBy,
          items: freeze([...partitionBy.items, ...items])
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/over-node.js
var OverNode;
var init_over_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/over-node.js"() {
    init_object_utils();
    init_order_by_node();
    init_partition_by_node();
    OverNode = freeze({
      is(node) {
        return node.kind === "OverNode";
      },
      create() {
        return freeze({
          kind: "OverNode"
        });
      },
      cloneWithOrderByItems(overNode, items) {
        return freeze({
          ...overNode,
          orderBy: overNode.orderBy ? OrderByNode.cloneWithItems(overNode.orderBy, items) : OrderByNode.create(items)
        });
      },
      cloneWithPartitionByItems(overNode, items) {
        return freeze({
          ...overNode,
          partitionBy: overNode.partitionBy ? PartitionByNode.cloneWithItems(overNode.partitionBy, items) : PartitionByNode.create(items)
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/from-node.js
var FromNode;
var init_from_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/from-node.js"() {
    init_object_utils();
    FromNode = freeze({
      is(node) {
        return node.kind === "FromNode";
      },
      create(froms) {
        return freeze({
          kind: "FromNode",
          froms: freeze(froms)
        });
      },
      cloneWithFroms(from, froms) {
        return freeze({
          ...from,
          froms: freeze([...from.froms, ...froms])
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/group-by-node.js
var GroupByNode;
var init_group_by_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/group-by-node.js"() {
    init_object_utils();
    GroupByNode = freeze({
      is(node) {
        return node.kind === "GroupByNode";
      },
      create(items) {
        return freeze({
          kind: "GroupByNode",
          items: freeze(items)
        });
      },
      cloneWithItems(groupBy, items) {
        return freeze({
          ...groupBy,
          items: freeze([...groupBy.items, ...items])
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/having-node.js
var HavingNode;
var init_having_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/having-node.js"() {
    init_object_utils();
    init_and_node();
    init_or_node();
    HavingNode = freeze({
      is(node) {
        return node.kind === "HavingNode";
      },
      create(filter) {
        return freeze({
          kind: "HavingNode",
          having: filter
        });
      },
      cloneWithOperation(havingNode, operator, operation) {
        return freeze({
          ...havingNode,
          having: operator === "And" ? AndNode.create(havingNode.having, operation) : OrNode.create(havingNode.having, operation)
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/select-query-node.js
var SelectQueryNode;
var init_select_query_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/select-query-node.js"() {
    init_object_utils();
    init_from_node();
    init_group_by_node();
    init_having_node();
    init_order_by_node();
    SelectQueryNode = freeze({
      is(node) {
        return node.kind === "SelectQueryNode";
      },
      create(withNode) {
        return freeze({
          kind: "SelectQueryNode",
          ...withNode && { with: withNode }
        });
      },
      createFrom(fromItems, withNode) {
        return freeze({
          kind: "SelectQueryNode",
          from: FromNode.create(fromItems),
          ...withNode && { with: withNode }
        });
      },
      cloneWithSelections(select, selections) {
        return freeze({
          ...select,
          selections: select.selections ? freeze([...select.selections, ...selections]) : freeze(selections)
        });
      },
      cloneWithDistinctOn(select, expressions) {
        return freeze({
          ...select,
          distinctOn: select.distinctOn ? freeze([...select.distinctOn, ...expressions]) : freeze(expressions)
        });
      },
      cloneWithFrontModifier(select, modifier) {
        return freeze({
          ...select,
          frontModifiers: select.frontModifiers ? freeze([...select.frontModifiers, modifier]) : freeze([modifier])
        });
      },
      cloneWithEndModifier(select, modifier) {
        return freeze({
          ...select,
          endModifiers: select.endModifiers ? freeze([...select.endModifiers, modifier]) : freeze([modifier])
        });
      },
      cloneWithOrderByItems(selectNode, items) {
        return freeze({
          ...selectNode,
          orderBy: selectNode.orderBy ? OrderByNode.cloneWithItems(selectNode.orderBy, items) : OrderByNode.create(items)
        });
      },
      cloneWithGroupByItems(selectNode, items) {
        return freeze({
          ...selectNode,
          groupBy: selectNode.groupBy ? GroupByNode.cloneWithItems(selectNode.groupBy, items) : GroupByNode.create(items)
        });
      },
      cloneWithLimit(selectNode, limit) {
        return freeze({
          ...selectNode,
          limit
        });
      },
      cloneWithOffset(selectNode, offset) {
        return freeze({
          ...selectNode,
          offset
        });
      },
      cloneWithHaving(selectNode, operation) {
        return freeze({
          ...selectNode,
          having: selectNode.having ? HavingNode.cloneWithOperation(selectNode.having, "And", operation) : HavingNode.create(operation)
        });
      },
      cloneWithSetOperations(selectNode, setOperations) {
        return freeze({
          ...selectNode,
          setOperations: selectNode.setOperations ? freeze([...selectNode.setOperations, ...setOperations]) : freeze([...setOperations])
        });
      },
      cloneWithoutSelections(select) {
        return freeze({
          ...select,
          selections: []
        });
      },
      cloneWithoutLimit(select) {
        return freeze({
          ...select,
          limit: void 0
        });
      },
      cloneWithoutOffset(select) {
        return freeze({
          ...select,
          offset: void 0
        });
      },
      cloneWithoutOrderBy(select) {
        return freeze({
          ...select,
          orderBy: void 0
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/util/prevent-await.js
function preventAwait(clazz, message2) {
  Object.defineProperties(clazz.prototype, {
    then: {
      enumerable: false,
      value: () => {
        throw new Error(message2);
      }
    }
  });
}
var init_prevent_await = __esm({
  "node_modules/kysely/dist/esm/util/prevent-await.js"() {
  }
});

// node_modules/kysely/dist/esm/query-builder/join-builder.js
var JoinBuilder;
var init_join_builder = __esm({
  "node_modules/kysely/dist/esm/query-builder/join-builder.js"() {
    init_join_node();
    init_raw_node();
    init_binary_operation_parser();
    init_object_utils();
    init_prevent_await();
    JoinBuilder = class _JoinBuilder {
      #props;
      constructor(props) {
        this.#props = freeze(props);
      }
      on(...args) {
        return new _JoinBuilder({
          ...this.#props,
          joinNode: JoinNode.cloneWithOn(this.#props.joinNode, parseValueBinaryOperationOrExpression(args))
        });
      }
      /**
       * Just like {@link WhereInterface.whereRef} but adds an item to the join's
       * `on` clause instead.
       *
       * See {@link WhereInterface.whereRef} for documentation and examples.
       */
      onRef(lhs, op, rhs) {
        return new _JoinBuilder({
          ...this.#props,
          joinNode: JoinNode.cloneWithOn(this.#props.joinNode, parseReferentialBinaryOperation(lhs, op, rhs))
        });
      }
      /**
       * Adds `on true`.
       */
      onTrue() {
        return new _JoinBuilder({
          ...this.#props,
          joinNode: JoinNode.cloneWithOn(this.#props.joinNode, RawNode.createWithSql("true"))
        });
      }
      /**
       * Simply calls the provided function passing `this` as the only argument. `$call` returns
       * what the provided function returns.
       */
      $call(func) {
        return func(this);
      }
      toOperationNode() {
        return this.#props.joinNode;
      }
    };
    preventAwait(JoinBuilder, "don't await JoinBuilder instances. They are never executed directly and are always just a part of a query.");
  }
});

// node_modules/kysely/dist/esm/operation-node/partition-by-item-node.js
var PartitionByItemNode;
var init_partition_by_item_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/partition-by-item-node.js"() {
    init_object_utils();
    PartitionByItemNode = freeze({
      is(node) {
        return node.kind === "PartitionByItemNode";
      },
      create(partitionBy) {
        return freeze({
          kind: "PartitionByItemNode",
          partitionBy
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/parser/partition-by-parser.js
function parsePartitionBy(partitionBy) {
  return parseReferenceExpressionOrList(partitionBy).map(PartitionByItemNode.create);
}
var init_partition_by_parser = __esm({
  "node_modules/kysely/dist/esm/parser/partition-by-parser.js"() {
    init_partition_by_item_node();
    init_reference_parser();
  }
});

// node_modules/kysely/dist/esm/query-builder/over-builder.js
var OverBuilder;
var init_over_builder = __esm({
  "node_modules/kysely/dist/esm/query-builder/over-builder.js"() {
    init_over_node();
    init_order_by_parser();
    init_partition_by_parser();
    init_object_utils();
    init_prevent_await();
    OverBuilder = class _OverBuilder {
      #props;
      constructor(props) {
        this.#props = freeze(props);
      }
      /**
       * Adds an order by clause item inside the over function.
       *
       * ```ts
       * const result = await db
       *   .selectFrom('person')
       *   .select(
       *     (eb) => eb.fn.avg<number>('age').over(
       *       ob => ob.orderBy('first_name', 'asc').orderBy('last_name', 'asc')
       *     ).as('average_age')
       *   )
       *   .execute()
       * ```
       *
       * The generated SQL (PostgreSQL):
       *
       * ```sql
       * select avg("age") over(order by "first_name" asc, "last_name" asc) as "average_age"
       * from "person"
       * ```
       */
      orderBy(orderBy, direction) {
        return new _OverBuilder({
          overNode: OverNode.cloneWithOrderByItems(this.#props.overNode, parseOrderBy([orderBy, direction]))
        });
      }
      partitionBy(partitionBy) {
        return new _OverBuilder({
          overNode: OverNode.cloneWithPartitionByItems(this.#props.overNode, parsePartitionBy(partitionBy))
        });
      }
      /**
       * Simply calls the provided function passing `this` as the only argument. `$call` returns
       * what the provided function returns.
       */
      $call(func) {
        return func(this);
      }
      toOperationNode() {
        return this.#props.overNode;
      }
    };
    preventAwait(OverBuilder, "don't await OverBuilder instances. They are never executed directly and are always just a part of a query.");
  }
});

// node_modules/kysely/dist/esm/operation-node/selection-node.js
var SelectionNode;
var init_selection_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/selection-node.js"() {
    init_object_utils();
    init_reference_node();
    init_select_all_node();
    SelectionNode = freeze({
      is(node) {
        return node.kind === "SelectionNode";
      },
      create(selection) {
        return freeze({
          kind: "SelectionNode",
          selection
        });
      },
      createSelectAll() {
        return freeze({
          kind: "SelectionNode",
          selection: SelectAllNode.create()
        });
      },
      createSelectAllFromTable(table) {
        return freeze({
          kind: "SelectionNode",
          selection: ReferenceNode.createSelectAll(table)
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/parser/select-parser.js
function parseSelectArg(selection) {
  if (isFunction(selection)) {
    return parseSelectArg(selection(expressionBuilder()));
  } else if (isReadonlyArray(selection)) {
    return selection.map((it) => parseSelectExpression(it));
  } else {
    return [parseSelectExpression(selection)];
  }
}
function parseSelectExpression(selection) {
  if (isString2(selection)) {
    return SelectionNode.create(parseAliasedStringReference(selection));
  } else if (isDynamicReferenceBuilder(selection)) {
    return SelectionNode.create(selection.toOperationNode());
  } else {
    return SelectionNode.create(parseAliasedExpression(selection));
  }
}
function parseSelectAll(table) {
  if (!table) {
    return [SelectionNode.createSelectAll()];
  } else if (Array.isArray(table)) {
    return table.map(parseSelectAllArg);
  } else {
    return [parseSelectAllArg(table)];
  }
}
function parseSelectAllArg(table) {
  if (isString2(table)) {
    return SelectionNode.createSelectAllFromTable(parseTable(table));
  }
  throw new Error(`invalid value selectAll expression: ${JSON.stringify(table)}`);
}
var init_select_parser = __esm({
  "node_modules/kysely/dist/esm/parser/select-parser.js"() {
    init_object_utils();
    init_selection_node();
    init_reference_parser();
    init_dynamic_reference_builder();
    init_expression_parser();
    init_table_parser();
    init_expression_builder();
  }
});

// node_modules/kysely/dist/esm/operation-node/values-node.js
var ValuesNode;
var init_values_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/values-node.js"() {
    init_object_utils();
    ValuesNode = freeze({
      is(node) {
        return node.kind === "ValuesNode";
      },
      create(values) {
        return freeze({
          kind: "ValuesNode",
          values: freeze(values)
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/default-insert-value-node.js
var DefaultInsertValueNode;
var init_default_insert_value_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/default-insert-value-node.js"() {
    init_object_utils();
    DefaultInsertValueNode = freeze({
      is(node) {
        return node.kind === "DefaultInsertValueNode";
      },
      create() {
        return freeze({
          kind: "DefaultInsertValueNode"
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/parser/insert-values-parser.js
function parseInsertExpression(arg) {
  const objectOrList = isFunction(arg) ? arg(expressionBuilder()) : arg;
  const list = isReadonlyArray(objectOrList) ? objectOrList : freeze([objectOrList]);
  return parseInsertColumnsAndValues(list);
}
function parseInsertColumnsAndValues(rows) {
  const columns = parseColumnNamesAndIndexes(rows);
  return [
    freeze([...columns.keys()].map(ColumnNode.create)),
    ValuesNode.create(rows.map((row) => parseRowValues(row, columns)))
  ];
}
function parseColumnNamesAndIndexes(rows) {
  const columns = /* @__PURE__ */ new Map();
  for (const row of rows) {
    const cols = Object.keys(row);
    for (const col of cols) {
      if (!columns.has(col) && row[col] !== void 0) {
        columns.set(col, columns.size);
      }
    }
  }
  return columns;
}
function parseRowValues(row, columns) {
  const rowColumns = Object.keys(row);
  const rowValues = Array.from({
    length: columns.size
  });
  let hasUndefinedOrComplexColumns = false;
  for (const col of rowColumns) {
    const columnIdx = columns.get(col);
    if (isUndefined3(columnIdx)) {
      continue;
    }
    const value = row[col];
    if (isUndefined3(value) || isExpressionOrFactory(value)) {
      hasUndefinedOrComplexColumns = true;
    }
    rowValues[columnIdx] = value;
  }
  const hasMissingColumns = rowColumns.length < columns.size;
  if (hasMissingColumns || hasUndefinedOrComplexColumns) {
    const defaultValue = DefaultInsertValueNode.create();
    return ValueListNode.create(rowValues.map((it) => isUndefined3(it) ? defaultValue : parseValueExpression(it)));
  }
  return PrimitiveValueListNode.create(rowValues);
}
var init_insert_values_parser = __esm({
  "node_modules/kysely/dist/esm/parser/insert-values-parser.js"() {
    init_column_node();
    init_primitive_value_list_node();
    init_value_list_node();
    init_object_utils();
    init_value_parser();
    init_values_node();
    init_expression_parser();
    init_default_insert_value_node();
    init_expression_builder();
  }
});

// node_modules/kysely/dist/esm/operation-node/insert-query-node.js
var InsertQueryNode;
var init_insert_query_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/insert-query-node.js"() {
    init_object_utils();
    InsertQueryNode = freeze({
      is(node) {
        return node.kind === "InsertQueryNode";
      },
      create(into, withNode, replace) {
        return freeze({
          kind: "InsertQueryNode",
          into,
          ...withNode && { with: withNode },
          replace
        });
      },
      cloneWith(insertQuery, props) {
        return freeze({
          ...insertQuery,
          ...props
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/update-query-node.js
var UpdateQueryNode;
var init_update_query_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/update-query-node.js"() {
    init_object_utils();
    init_from_node();
    UpdateQueryNode = freeze({
      is(node) {
        return node.kind === "UpdateQueryNode";
      },
      create(table, withNode) {
        return freeze({
          kind: "UpdateQueryNode",
          table,
          ...withNode && { with: withNode }
        });
      },
      cloneWithFromItems(updateQuery, fromItems) {
        return freeze({
          ...updateQuery,
          from: updateQuery.from ? FromNode.cloneWithFroms(updateQuery.from, fromItems) : FromNode.create(fromItems)
        });
      },
      cloneWithUpdates(updateQuery, updates) {
        return freeze({
          ...updateQuery,
          updates: updateQuery.updates ? freeze([...updateQuery.updates, ...updates]) : updates
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/using-node.js
var UsingNode;
var init_using_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/using-node.js"() {
    init_object_utils();
    UsingNode = freeze({
      is(node) {
        return node.kind === "UsingNode";
      },
      create(tables) {
        return freeze({
          kind: "UsingNode",
          tables: freeze(tables)
        });
      },
      cloneWithTables(using, tables) {
        return freeze({
          ...using,
          tables: freeze([...using.tables, ...tables])
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/delete-query-node.js
var DeleteQueryNode;
var init_delete_query_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/delete-query-node.js"() {
    init_object_utils();
    init_from_node();
    init_order_by_node();
    init_using_node();
    DeleteQueryNode = freeze({
      is(node) {
        return node.kind === "DeleteQueryNode";
      },
      create(fromItems, withNode) {
        return freeze({
          kind: "DeleteQueryNode",
          from: FromNode.create(fromItems),
          ...withNode && { with: withNode }
        });
      },
      cloneWithOrderByItems(deleteNode, items) {
        return freeze({
          ...deleteNode,
          orderBy: deleteNode.orderBy ? OrderByNode.cloneWithItems(deleteNode.orderBy, items) : OrderByNode.create(items)
        });
      },
      cloneWithLimit(deleteNode, limit) {
        return freeze({
          ...deleteNode,
          limit
        });
      },
      cloneWithUsing(deleteNode, tables) {
        return freeze({
          ...deleteNode,
          using: deleteNode.using !== void 0 ? UsingNode.cloneWithTables(deleteNode.using, tables) : UsingNode.create(tables)
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/where-node.js
var WhereNode;
var init_where_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/where-node.js"() {
    init_object_utils();
    init_and_node();
    init_or_node();
    WhereNode = freeze({
      is(node) {
        return node.kind === "WhereNode";
      },
      create(filter) {
        return freeze({
          kind: "WhereNode",
          where: filter
        });
      },
      cloneWithOperation(whereNode, operator, operation) {
        return freeze({
          ...whereNode,
          where: operator === "And" ? AndNode.create(whereNode.where, operation) : OrNode.create(whereNode.where, operation)
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/returning-node.js
var ReturningNode;
var init_returning_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/returning-node.js"() {
    init_object_utils();
    ReturningNode = freeze({
      is(node) {
        return node.kind === "ReturningNode";
      },
      create(selections) {
        return freeze({
          kind: "ReturningNode",
          selections: freeze(selections)
        });
      },
      cloneWithSelections(returning, selections) {
        return freeze({
          ...returning,
          selections: returning.selections ? freeze([...returning.selections, ...selections]) : freeze(selections)
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/explain-node.js
var ExplainNode;
var init_explain_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/explain-node.js"() {
    init_object_utils();
    ExplainNode = freeze({
      is(node) {
        return node.kind === "ExplainNode";
      },
      create(format, options) {
        return freeze({
          kind: "ExplainNode",
          format,
          options
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/query-node.js
var QueryNode;
var init_query_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/query-node.js"() {
    init_insert_query_node();
    init_select_query_node();
    init_update_query_node();
    init_delete_query_node();
    init_where_node();
    init_object_utils();
    init_returning_node();
    init_explain_node();
    QueryNode = freeze({
      is(node) {
        return SelectQueryNode.is(node) || InsertQueryNode.is(node) || UpdateQueryNode.is(node) || DeleteQueryNode.is(node);
      },
      cloneWithWhere(node, operation) {
        return freeze({
          ...node,
          where: node.where ? WhereNode.cloneWithOperation(node.where, "And", operation) : WhereNode.create(operation)
        });
      },
      cloneWithJoin(node, join) {
        return freeze({
          ...node,
          joins: node.joins ? freeze([...node.joins, join]) : freeze([join])
        });
      },
      cloneWithReturning(node, selections) {
        return freeze({
          ...node,
          returning: node.returning ? ReturningNode.cloneWithSelections(node.returning, selections) : ReturningNode.create(selections)
        });
      },
      cloneWithoutWhere(node) {
        return freeze({
          ...node,
          where: void 0
        });
      },
      cloneWithExplain(node, format, options) {
        return freeze({
          ...node,
          explain: ExplainNode.create(format, options?.toOperationNode())
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/column-update-node.js
var ColumnUpdateNode;
var init_column_update_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/column-update-node.js"() {
    init_object_utils();
    ColumnUpdateNode = freeze({
      is(node) {
        return node.kind === "ColumnUpdateNode";
      },
      create(column, value) {
        return freeze({
          kind: "ColumnUpdateNode",
          column,
          value
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/parser/update-set-parser.js
function parseUpdateExpression(update) {
  const updateObj = isFunction(update) ? update(expressionBuilder()) : update;
  return Object.entries(updateObj).filter(([_, value]) => value !== void 0).map(([key, value]) => {
    return ColumnUpdateNode.create(ColumnNode.create(key), parseValueExpression(value));
  });
}
var init_update_set_parser = __esm({
  "node_modules/kysely/dist/esm/parser/update-set-parser.js"() {
    init_column_node();
    init_column_update_node();
    init_expression_builder();
    init_object_utils();
    init_value_parser();
  }
});

// node_modules/kysely/dist/esm/operation-node/on-duplicate-key-node.js
var OnDuplicateKeyNode;
var init_on_duplicate_key_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/on-duplicate-key-node.js"() {
    init_object_utils();
    OnDuplicateKeyNode = freeze({
      is(node) {
        return node.kind === "OnDuplicateKeyNode";
      },
      create(updates) {
        return freeze({
          kind: "OnDuplicateKeyNode",
          updates
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/query-builder/insert-result.js
var InsertResult;
var init_insert_result = __esm({
  "node_modules/kysely/dist/esm/query-builder/insert-result.js"() {
    InsertResult = class {
      /**
       * The auto incrementing primary key
       */
      insertId;
      /**
       * Affected rows count.
       */
      numInsertedOrUpdatedRows;
      constructor(insertId, numInsertedOrUpdatedRows) {
        this.insertId = insertId;
        this.numInsertedOrUpdatedRows = numInsertedOrUpdatedRows;
      }
    };
  }
});

// node_modules/kysely/dist/esm/query-builder/no-result-error.js
function isNoResultErrorConstructor(fn) {
  return Object.prototype.hasOwnProperty.call(fn, "prototype");
}
var NoResultError;
var init_no_result_error = __esm({
  "node_modules/kysely/dist/esm/query-builder/no-result-error.js"() {
    NoResultError = class extends Error {
      /**
       * The operation node tree of the query that was executed.
       */
      node;
      constructor(node) {
        super("no result");
        this.node = node;
      }
    };
  }
});

// node_modules/kysely/dist/esm/operation-node/on-conflict-node.js
var OnConflictNode;
var init_on_conflict_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/on-conflict-node.js"() {
    init_object_utils();
    init_where_node();
    OnConflictNode = freeze({
      is(node) {
        return node.kind === "OnConflictNode";
      },
      create() {
        return freeze({
          kind: "OnConflictNode"
        });
      },
      cloneWith(node, props) {
        return freeze({
          ...node,
          ...props
        });
      },
      cloneWithIndexWhere(node, operation) {
        return freeze({
          ...node,
          indexWhere: node.indexWhere ? WhereNode.cloneWithOperation(node.indexWhere, "And", operation) : WhereNode.create(operation)
        });
      },
      cloneWithIndexOrWhere(node, operation) {
        return freeze({
          ...node,
          indexWhere: node.indexWhere ? WhereNode.cloneWithOperation(node.indexWhere, "Or", operation) : WhereNode.create(operation)
        });
      },
      cloneWithUpdateWhere(node, operation) {
        return freeze({
          ...node,
          updateWhere: node.updateWhere ? WhereNode.cloneWithOperation(node.updateWhere, "And", operation) : WhereNode.create(operation)
        });
      },
      cloneWithUpdateOrWhere(node, operation) {
        return freeze({
          ...node,
          updateWhere: node.updateWhere ? WhereNode.cloneWithOperation(node.updateWhere, "Or", operation) : WhereNode.create(operation)
        });
      },
      cloneWithoutIndexWhere(node) {
        return freeze({
          ...node,
          indexWhere: void 0
        });
      },
      cloneWithoutUpdateWhere(node) {
        return freeze({
          ...node,
          updateWhere: void 0
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/query-builder/on-conflict-builder.js
var OnConflictBuilder, OnConflictDoNothingBuilder, OnConflictUpdateBuilder;
var init_on_conflict_builder = __esm({
  "node_modules/kysely/dist/esm/query-builder/on-conflict-builder.js"() {
    init_column_node();
    init_identifier_node();
    init_on_conflict_node();
    init_binary_operation_parser();
    init_update_set_parser();
    init_object_utils();
    init_prevent_await();
    OnConflictBuilder = class _OnConflictBuilder {
      #props;
      constructor(props) {
        this.#props = freeze(props);
      }
      /**
       * Specify a single column as the conflict target.
       *
       * Also see the {@link columns}, {@link constraint} and {@link expression}
       * methods for alternative ways to specify the conflict target.
       */
      column(column) {
        const columnNode = ColumnNode.create(column);
        return new _OnConflictBuilder({
          ...this.#props,
          onConflictNode: OnConflictNode.cloneWith(this.#props.onConflictNode, {
            columns: this.#props.onConflictNode.columns ? freeze([...this.#props.onConflictNode.columns, columnNode]) : freeze([columnNode])
          })
        });
      }
      /**
       * Specify a list of columns as the conflict target.
       *
       * Also see the {@link column}, {@link constraint} and {@link expression}
       * methods for alternative ways to specify the conflict target.
       */
      columns(columns) {
        const columnNodes = columns.map(ColumnNode.create);
        return new _OnConflictBuilder({
          ...this.#props,
          onConflictNode: OnConflictNode.cloneWith(this.#props.onConflictNode, {
            columns: this.#props.onConflictNode.columns ? freeze([...this.#props.onConflictNode.columns, ...columnNodes]) : freeze(columnNodes)
          })
        });
      }
      /**
       * Specify a specific constraint by name as the conflict target.
       *
       * Also see the {@link column}, {@link columns} and {@link expression}
       * methods for alternative ways to specify the conflict target.
       */
      constraint(constraintName) {
        return new _OnConflictBuilder({
          ...this.#props,
          onConflictNode: OnConflictNode.cloneWith(this.#props.onConflictNode, {
            constraint: IdentifierNode.create(constraintName)
          })
        });
      }
      /**
       * Specify an expression as the conflict target.
       *
       * This can be used if the unique index is an expression index.
       *
       * Also see the {@link column}, {@link columns} and {@link constraint}
       * methods for alternative ways to specify the conflict target.
       */
      expression(expression) {
        return new _OnConflictBuilder({
          ...this.#props,
          onConflictNode: OnConflictNode.cloneWith(this.#props.onConflictNode, {
            indexExpression: expression.toOperationNode()
          })
        });
      }
      where(...args) {
        return new _OnConflictBuilder({
          ...this.#props,
          onConflictNode: OnConflictNode.cloneWithIndexWhere(this.#props.onConflictNode, parseValueBinaryOperationOrExpression(args))
        });
      }
      /**
       * Specify an index predicate for the index target.
       *
       * See {@link WhereInterface.whereRef} for more info.
       */
      whereRef(lhs, op, rhs) {
        return new _OnConflictBuilder({
          ...this.#props,
          onConflictNode: OnConflictNode.cloneWithIndexWhere(this.#props.onConflictNode, parseReferentialBinaryOperation(lhs, op, rhs))
        });
      }
      clearWhere() {
        return new _OnConflictBuilder({
          ...this.#props,
          onConflictNode: OnConflictNode.cloneWithoutIndexWhere(this.#props.onConflictNode)
        });
      }
      /**
       * Adds the "do nothing" conflict action.
       *
       * ### Examples
       *
       * ```ts
       * await db
       *   .insertInto('person')
       *   .values({ first_name, pic })
       *   .onConflict((oc) => oc
       *     .column('pic')
       *     .doNothing()
       *   )
       * ```
       *
       * The generated SQL (PostgreSQL):
       *
       * ```sql
       * insert into "person" ("first_name", "pic")
       * values ($1, $2)
       * on conflict ("pic") do nothing
       * ```
       */
      doNothing() {
        return new OnConflictDoNothingBuilder({
          ...this.#props,
          onConflictNode: OnConflictNode.cloneWith(this.#props.onConflictNode, {
            doNothing: true
          })
        });
      }
      /**
       * Adds the "do update set" conflict action.
       *
       * ### Examples
       *
       * ```ts
       * await db
       *   .insertInto('person')
       *   .values({ first_name, pic })
       *   .onConflict((oc) => oc
       *     .column('pic')
       *     .doUpdateSet({ first_name })
       *   )
       * ```
       *
       * The generated SQL (PostgreSQL):
       *
       * ```sql
       * insert into "person" ("first_name", "pic")
       * values ($1, $2)
       * on conflict ("pic")
       * do update set "first_name" = $3
       * ```
       *
       * In the next example we use the `ref` method to reference
       * columns of the virtual table `excluded` in a type-safe way
       * to create an upsert operation:
       *
       * ```ts
       * db.insertInto('person')
       *   .values(person)
       *   .onConflict((oc) => oc
       *     .column('id')
       *     .doUpdateSet((eb) => ({
       *       first_name: eb.ref('excluded.first_name'),
       *       last_name: eb.ref('excluded.last_name')
       *     }))
       *   )
       * ```
       */
      doUpdateSet(update) {
        return new OnConflictUpdateBuilder({
          ...this.#props,
          onConflictNode: OnConflictNode.cloneWith(this.#props.onConflictNode, {
            updates: parseUpdateExpression(update)
          })
        });
      }
      /**
       * Simply calls the provided function passing `this` as the only argument. `$call` returns
       * what the provided function returns.
       */
      $call(func) {
        return func(this);
      }
    };
    preventAwait(OnConflictBuilder, "don't await OnConflictBuilder instances.");
    OnConflictDoNothingBuilder = class {
      #props;
      constructor(props) {
        this.#props = freeze(props);
      }
      toOperationNode() {
        return this.#props.onConflictNode;
      }
    };
    preventAwait(OnConflictDoNothingBuilder, "don't await OnConflictDoNothingBuilder instances.");
    OnConflictUpdateBuilder = class _OnConflictUpdateBuilder {
      #props;
      constructor(props) {
        this.#props = freeze(props);
      }
      where(...args) {
        return new _OnConflictUpdateBuilder({
          ...this.#props,
          onConflictNode: OnConflictNode.cloneWithUpdateWhere(this.#props.onConflictNode, parseValueBinaryOperationOrExpression(args))
        });
      }
      /**
       * Specify a where condition for the update operation.
       *
       * See {@link WhereInterface.whereRef} for more info.
       */
      whereRef(lhs, op, rhs) {
        return new _OnConflictUpdateBuilder({
          ...this.#props,
          onConflictNode: OnConflictNode.cloneWithUpdateWhere(this.#props.onConflictNode, parseReferentialBinaryOperation(lhs, op, rhs))
        });
      }
      clearWhere() {
        return new _OnConflictUpdateBuilder({
          ...this.#props,
          onConflictNode: OnConflictNode.cloneWithoutUpdateWhere(this.#props.onConflictNode)
        });
      }
      /**
       * Simply calls the provided function passing `this` as the only argument. `$call` returns
       * what the provided function returns.
       */
      $call(func) {
        return func(this);
      }
      toOperationNode() {
        return this.#props.onConflictNode;
      }
    };
    preventAwait(OnConflictUpdateBuilder, "don't await OnConflictUpdateBuilder instances.");
  }
});

// node_modules/kysely/dist/esm/query-builder/insert-query-builder.js
var InsertQueryBuilder;
var init_insert_query_builder = __esm({
  "node_modules/kysely/dist/esm/query-builder/insert-query-builder.js"() {
    init_select_parser();
    init_insert_values_parser();
    init_insert_query_node();
    init_query_node();
    init_update_set_parser();
    init_prevent_await();
    init_object_utils();
    init_on_duplicate_key_node();
    init_insert_result();
    init_no_result_error();
    init_expression_parser();
    init_column_node();
    init_on_conflict_builder();
    init_on_conflict_node();
    InsertQueryBuilder = class _InsertQueryBuilder {
      #props;
      constructor(props) {
        this.#props = freeze(props);
      }
      values(insert) {
        const [columns, values] = parseInsertExpression(insert);
        return new _InsertQueryBuilder({
          ...this.#props,
          queryNode: InsertQueryNode.cloneWith(this.#props.queryNode, {
            columns,
            values
          })
        });
      }
      /**
       * Sets the columns to insert.
       *
       * The {@link values} method sets both the columns and the values and this method
       * is not needed. But if you are using the {@link expression} method, you can use
       * this method to set the columns to insert.
       *
       * ### Examples
       *
       * ```ts
       * db.insertInto('person')
       *   .columns(['first_name'])
       *   .expression((eb) => eb.selectFrom('pet').select('pet.name'))
       * ```
       *
       * The generated SQL (PostgreSQL):
       *
       * ```sql
       * insert into "person" ("first_name")
       * select "pet"."name" from "pet"
       * ```
       */
      columns(columns) {
        return new _InsertQueryBuilder({
          ...this.#props,
          queryNode: InsertQueryNode.cloneWith(this.#props.queryNode, {
            columns: freeze(columns.map(ColumnNode.create))
          })
        });
      }
      /**
       * Insert an arbitrary expression. For example the result of a select query.
       *
       * ### Examples
       *
       * <!-- siteExample("insert", "Insert subquery", 50) -->
       *
       * You can create an `INSERT INTO SELECT FROM` query using the `expression` method:
       *
       * ```ts
       * const result = await db.insertInto('person')
       *   .columns(['first_name', 'last_name', 'age'])
       *   .expression((eb) => eb
       *     .selectFrom('pet')
       *     .select((eb) => [
       *       'pet.name',
       *       eb.val('Petson').as('last_name'),
       *       eb.val(7).as('age'),
       *     ])
       *   )
       *   .execute()
       * ```
       *
       * The generated SQL (PostgreSQL):
       *
       * ```sql
       * insert into "person" ("first_name", "last_name", "age")
       * select "pet"."name", $1 as "first_name", $2 as "last_name" from "pet"
       * ```
       */
      expression(expression) {
        return new _InsertQueryBuilder({
          ...this.#props,
          queryNode: InsertQueryNode.cloneWith(this.#props.queryNode, {
            values: parseExpression(expression)
          })
        });
      }
      /**
       * Changes an `insert into` query to an `insert ignore into` query.
       *
       * If you use the ignore modifier, ignorable errors that occur while executing the
       * insert statement are ignored. For example, without ignore, a row that duplicates
       * an existing unique index or primary key value in the table causes a duplicate-key
       * error and the statement is aborted. With ignore, the row is discarded and no error
       * occurs.
       *
       * This is only supported on some dialects like MySQL. On most dialects you should
       * use the {@link onConflict} method.
       *
       * ### Examples
       *
       * ```ts
       * await db.insertInto('person')
       *   .ignore()
       *   .values(values)
       *   .execute()
       * ```
       */
      ignore() {
        return new _InsertQueryBuilder({
          ...this.#props,
          queryNode: InsertQueryNode.cloneWith(this.#props.queryNode, {
            ignore: true
          })
        });
      }
      /**
       * Adds an `on conflict` clause to the query.
       *
       * `on conflict` is only supported by some dialects like PostgreSQL and SQLite. On MySQL
       * you can use {@link ignore} and {@link onDuplicateKeyUpdate} to achieve similar results.
       *
       * ### Examples
       *
       * ```ts
       * await db
       *   .insertInto('pet')
       *   .values({
       *     name: 'Catto',
       *     species: 'cat',
       *   })
       *   .onConflict((oc) => oc
       *     .column('name')
       *     .doUpdateSet({ species: 'hamster' })
       *   )
       *   .execute()
       * ```
       *
       * The generated SQL (PostgreSQL):
       *
       * ```sql
       * insert into "pet" ("name", "species")
       * values ($1, $2)
       * on conflict ("name")
       * do update set "species" = $3
       * ```
       *
       * You can provide the name of the constraint instead of a column name:
       *
       * ```ts
       * await db
       *   .insertInto('pet')
       *   .values({
       *     name: 'Catto',
       *     species: 'cat',
       *   })
       *   .onConflict((oc) => oc
       *     .constraint('pet_name_key')
       *     .doUpdateSet({ species: 'hamster' })
       *   )
       *   .execute()
       * ```
       *
       * The generated SQL (PostgreSQL):
       *
       * ```sql
       * insert into "pet" ("name", "species")
       * values ($1, $2)
       * on conflict on constraint "pet_name_key"
       * do update set "species" = $3
       * ```
       *
       * You can also specify an expression as the conflict target in case
       * the unique index is an expression index:
       *
       * ```ts
       * import { sql } from 'kysely'
       *
       * await db
       *   .insertInto('pet')
       *   .values({
       *     name: 'Catto',
       *     species: 'cat',
       *   })
       *   .onConflict((oc) => oc
       *     .expression(sql`lower(name)`)
       *     .doUpdateSet({ species: 'hamster' })
       *   )
       *   .execute()
       * ```
       *
       * The generated SQL (PostgreSQL):
       *
       * ```sql
       * insert into "pet" ("name", "species")
       * values ($1, $2)
       * on conflict (lower(name))
       * do update set "species" = $3
       * ```
       *
       * You can add a filter for the update statement like this:
       *
       * ```ts
       * await db
       *   .insertInto('pet')
       *   .values({
       *     name: 'Catto',
       *     species: 'cat',
       *   })
       *   .onConflict((oc) => oc
       *     .column('name')
       *     .doUpdateSet({ species: 'hamster' })
       *     .where('excluded.name', '!=', 'Catto'')
       *   )
       *   .execute()
       * ```
       *
       * The generated SQL (PostgreSQL):
       *
       * ```sql
       * insert into "pet" ("name", "species")
       * values ($1, $2)
       * on conflict ("name")
       * do update set "species" = $3
       * where "excluded"."name" != $4
       * ```
       *
       * You can create an `on conflict do nothing` clauses like this:
       *
       * ```ts
       * await db
       *   .insertInto('pet')
       *   .values({
       *     name: 'Catto',
       *     species: 'cat',
       *   })
       *   .onConflict((oc) => oc
       *     .column('name')
       *     .doNothing()
       *   )
       *   .execute()
       * ```
       *
       * The generated SQL (PostgreSQL):
       *
       * ```sql
       * insert into "pet" ("name", "species")
       * values ($1, $2)
       * on conflict ("name") do nothing
       * ```
       *
       * You can refer to the columns of the virtual `excluded` table
       * in a type-safe way using a callback and the `ref` method of
       * `ExpressionBuilder`:
       *
       * ```ts
       * db.insertInto('person')
       *   .values(person)
       *   .onConflict(oc => oc
       *     .column('id')
       *     .doUpdateSet({
       *       first_name: (eb) => eb.ref('excluded.first_name'),
       *       last_name: (eb) => eb.ref('excluded.last_name')
       *     })
       *   )
       * ```
       */
      onConflict(callback) {
        return new _InsertQueryBuilder({
          ...this.#props,
          queryNode: InsertQueryNode.cloneWith(this.#props.queryNode, {
            onConflict: callback(new OnConflictBuilder({
              onConflictNode: OnConflictNode.create()
            })).toOperationNode()
          })
        });
      }
      /**
       * Adds `on duplicate key update` to the query.
       *
       * If you specify `on duplicate key update`, and a row is inserted that would cause
       * a duplicate value in a unique index or primary key, an update of the old row occurs.
       *
       * This is only implemented by some dialects like MySQL. On most dialects you should
       * use {@link onConflict} instead.
       *
       * ### Examples
       *
       * ```ts
       * await db
       *   .insertInto('person')
       *   .values(values)
       *   .onDuplicateKeyUpdate({ species: 'hamster' })
       * ```
       */
      onDuplicateKeyUpdate(update) {
        return new _InsertQueryBuilder({
          ...this.#props,
          queryNode: InsertQueryNode.cloneWith(this.#props.queryNode, {
            onDuplicateKey: OnDuplicateKeyNode.create(parseUpdateExpression(update))
          })
        });
      }
      returning(selection) {
        return new _InsertQueryBuilder({
          ...this.#props,
          queryNode: QueryNode.cloneWithReturning(this.#props.queryNode, parseSelectArg(selection))
        });
      }
      returningAll() {
        return new _InsertQueryBuilder({
          ...this.#props,
          queryNode: QueryNode.cloneWithReturning(this.#props.queryNode, parseSelectAll())
        });
      }
      /**
       * Simply calls the provided function passing `this` as the only argument. `$call` returns
       * what the provided function returns.
       *
       * If you want to conditionally call a method on `this`, see
       * the {@link $if} method.
       *
       * ### Examples
       *
       * The next example uses a helper function `log` to log a query:
       *
       * ```ts
       * function log<T extends Compilable>(qb: T): T {
       *   console.log(qb.compile())
       *   return qb
       * }
       *
       * db.updateTable('person')
       *   .set(values)
       *   .$call(log)
       *   .execute()
       * ```
       */
      $call(func) {
        return func(this);
      }
      /**
       * Call `func(this)` if `condition` is true.
       *
       * This method is especially handy with optional selects. Any `returning` or `returningAll`
       * method calls add columns as optional fields to the output type when called inside
       * the `func` callback. This is because we can't know if those selections were actually
       * made before running the code.
       *
       * You can also call any other methods inside the callback.
       *
       * ### Examples
       *
       * ```ts
       * async function insertPerson(values: InsertablePerson, returnLastName: boolean) {
       *   return await db
       *     .insertInto('person')
       *     .values(values)
       *     .returning(['id', 'first_name'])
       *     .$if(returnLastName, (qb) => qb.returning('last_name'))
       *     .executeTakeFirstOrThrow()
       * }
       * ```
       *
       * Any selections added inside the `if` callback will be added as optional fields to the
       * output type since we can't know if the selections were actually made before running
       * the code. In the example above the return type of the `insertPerson` function is:
       *
       * ```ts
       * {
       *   id: number
       *   first_name: string
       *   last_name?: string
       * }
       * ```
       */
      $if(condition, func) {
        if (condition) {
          return func(this);
        }
        return new _InsertQueryBuilder({
          ...this.#props
        });
      }
      /**
       * Change the output type of the query.
       *
       * You should only use this method as the last resort if the types
       * don't support your use case.
       */
      $castTo() {
        return new _InsertQueryBuilder(this.#props);
      }
      /**
       * Narrows (parts of) the output type of the query.
       *
       * Kysely tries to be as type-safe as possible, but in some cases we have to make
       * compromises for better maintainability and compilation performance. At present,
       * Kysely doesn't narrow the output type of the query based on {@link values} input
       * when using {@link returning} or {@link returningAll}.
       *
       * This utility method is very useful for these situations, as it removes unncessary
       * runtime assertion/guard code. Its input type is limited to the output type
       * of the query, so you can't add a column that doesn't exist, or change a column's
       * type to something that doesn't exist in its union type.
       *
       * ### Examples
       *
       * Turn this code:
       *
       * ```ts
       * const person = await db.insertInto('person')
       *   .values({ ...inputPerson, nullable_column: 'hell yeah!' })
       *   .returningAll()
       *   .executeTakeFirstOrThrow()
       *
       * if (nullable_column) {
       *   functionThatExpectsPersonWithNonNullValue(person)
       * }
       * ```
       *
       * Into this:
       *
       * ```ts
       * const person = await db.insertInto('person')
       *   .values({ ...inputPerson, nullable_column: 'hell yeah!' })
       *   .returningAll()
       *   .$narrowType<{ nullable_column: string }>()
       *   .executeTakeFirstOrThrow()
       *
       * functionThatExpectsPersonWithNonNullValue(person)
       * ```
       */
      $narrowType() {
        return new _InsertQueryBuilder(this.#props);
      }
      /**
       * Asserts that query's output row type equals the given type `T`.
       *
       * This method can be used to simplify excessively complex types to make typescript happy
       * and much faster.
       *
       * Kysely uses complex type magic to achieve its type safety. This complexity is sometimes too much
       * for typescript and you get errors like this:
       *
       * ```
       * error TS2589: Type instantiation is excessively deep and possibly infinite.
       * ```
       *
       * In these case you can often use this method to help typescript a little bit. When you use this
       * method to assert the output type of a query, Kysely can drop the complex output type that
       * consists of multiple nested helper types and replace it with the simple asserted type.
       *
       * Using this method doesn't reduce type safety at all. You have to pass in a type that is
       * structurally equal to the current type.
       *
       * ### Examples
       *
       * ```ts
       * const result = await db
       *   .with('new_person', (qb) => qb
       *     .insertInto('person')
       *     .values(person)
       *     .returning('id')
       *     .$assertType<{ id: string }>()
       *   )
       *   .with('new_pet', (qb) => qb
       *     .insertInto('pet')
       *     .values((eb) => ({ owner_id: eb.selectFrom('new_person').select('id'), ...pet }))
       *     .returning(['name as pet_name', 'species'])
       *     .$assertType<{ pet_name: string, species: Species }>()
       *   )
       *   .selectFrom(['new_person', 'new_pet'])
       *   .selectAll()
       *   .executeTakeFirstOrThrow()
       * ```
       */
      $assertType() {
        return new _InsertQueryBuilder(this.#props);
      }
      /**
       * Returns a copy of this InsertQueryBuilder instance with the given plugin installed.
       */
      withPlugin(plugin) {
        return new _InsertQueryBuilder({
          ...this.#props,
          executor: this.#props.executor.withPlugin(plugin)
        });
      }
      toOperationNode() {
        return this.#props.executor.transformQuery(this.#props.queryNode, this.#props.queryId);
      }
      compile() {
        return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
      }
      /**
       * Executes the query and returns an array of rows.
       *
       * Also see the {@link executeTakeFirst} and {@link executeTakeFirstOrThrow} methods.
       */
      async execute() {
        const compiledQuery = this.compile();
        const query = compiledQuery.query;
        const result = await this.#props.executor.executeQuery(compiledQuery, this.#props.queryId);
        if (this.#props.executor.adapter.supportsReturning && query.returning) {
          return result.rows;
        }
        return [
          new InsertResult(
            result.insertId,
            // TODO: remove numUpdatedOrDeletedRows.
            result.numAffectedRows ?? result.numUpdatedOrDeletedRows
          )
        ];
      }
      /**
       * Executes the query and returns the first result or undefined if
       * the query returned no result.
       */
      async executeTakeFirst() {
        const [result] = await this.execute();
        return result;
      }
      /**
       * Executes the query and returns the first result or throws if
       * the query returned no result.
       *
       * By default an instance of {@link NoResultError} is thrown, but you can
       * provide a custom error class, or callback as the only argument to throw a different
       * error.
       */
      async executeTakeFirstOrThrow(errorConstructor = NoResultError) {
        const result = await this.executeTakeFirst();
        if (result === void 0) {
          const error = isNoResultErrorConstructor(errorConstructor) ? new errorConstructor(this.toOperationNode()) : errorConstructor(this.toOperationNode());
          throw error;
        }
        return result;
      }
      async *stream(chunkSize = 100) {
        const compiledQuery = this.compile();
        const stream = this.#props.executor.stream(compiledQuery, chunkSize, this.#props.queryId);
        for await (const item of stream) {
          yield* item.rows;
        }
      }
      async explain(format, options) {
        const builder = new _InsertQueryBuilder({
          ...this.#props,
          queryNode: QueryNode.cloneWithExplain(this.#props.queryNode, format, options)
        });
        return await builder.execute();
      }
    };
    preventAwait(InsertQueryBuilder, "don't await InsertQueryBuilder instances directly. To execute the query you need to call `execute` or `executeTakeFirst`.");
  }
});

// node_modules/kysely/dist/esm/query-builder/delete-result.js
var DeleteResult;
var init_delete_result = __esm({
  "node_modules/kysely/dist/esm/query-builder/delete-result.js"() {
    DeleteResult = class {
      numDeletedRows;
      constructor(numDeletedRows) {
        this.numDeletedRows = numDeletedRows;
      }
    };
  }
});

// node_modules/kysely/dist/esm/operation-node/limit-node.js
var LimitNode;
var init_limit_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/limit-node.js"() {
    init_object_utils();
    init_value_node();
    LimitNode = freeze({
      is(node) {
        return node.kind === "LimitNode";
      },
      create(limit) {
        return freeze({
          kind: "LimitNode",
          limit: ValueNode.create(limit)
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/query-builder/delete-query-builder.js
var DeleteQueryBuilder;
var init_delete_query_builder = __esm({
  "node_modules/kysely/dist/esm/query-builder/delete-query-builder.js"() {
    init_join_parser();
    init_table_parser();
    init_select_parser();
    init_query_node();
    init_prevent_await();
    init_object_utils();
    init_no_result_error();
    init_delete_result();
    init_delete_query_node();
    init_limit_node();
    init_order_by_parser();
    init_binary_operation_parser();
    DeleteQueryBuilder = class _DeleteQueryBuilder {
      #props;
      constructor(props) {
        this.#props = freeze(props);
      }
      where(...args) {
        return new _DeleteQueryBuilder({
          ...this.#props,
          queryNode: QueryNode.cloneWithWhere(this.#props.queryNode, parseValueBinaryOperationOrExpression(args))
        });
      }
      whereRef(lhs, op, rhs) {
        return new _DeleteQueryBuilder({
          ...this.#props,
          queryNode: QueryNode.cloneWithWhere(this.#props.queryNode, parseReferentialBinaryOperation(lhs, op, rhs))
        });
      }
      clearWhere() {
        return new _DeleteQueryBuilder({
          ...this.#props,
          queryNode: QueryNode.cloneWithoutWhere(this.#props.queryNode)
        });
      }
      using(tables) {
        return new _DeleteQueryBuilder({
          ...this.#props,
          queryNode: DeleteQueryNode.cloneWithUsing(this.#props.queryNode, parseTableExpressionOrList(tables))
        });
      }
      innerJoin(...args) {
        return new _DeleteQueryBuilder({
          ...this.#props,
          queryNode: QueryNode.cloneWithJoin(this.#props.queryNode, parseJoin("InnerJoin", args))
        });
      }
      leftJoin(...args) {
        return new _DeleteQueryBuilder({
          ...this.#props,
          queryNode: QueryNode.cloneWithJoin(this.#props.queryNode, parseJoin("LeftJoin", args))
        });
      }
      rightJoin(...args) {
        return new _DeleteQueryBuilder({
          ...this.#props,
          queryNode: QueryNode.cloneWithJoin(this.#props.queryNode, parseJoin("RightJoin", args))
        });
      }
      fullJoin(...args) {
        return new _DeleteQueryBuilder({
          ...this.#props,
          queryNode: QueryNode.cloneWithJoin(this.#props.queryNode, parseJoin("FullJoin", args))
        });
      }
      returning(selection) {
        return new _DeleteQueryBuilder({
          ...this.#props,
          queryNode: QueryNode.cloneWithReturning(this.#props.queryNode, parseSelectArg(selection))
        });
      }
      returningAll(table) {
        return new _DeleteQueryBuilder({
          ...this.#props,
          queryNode: QueryNode.cloneWithReturning(this.#props.queryNode, parseSelectAll(table))
        });
      }
      /**
       * Adds an `order by` clause to the query.
       *
       * `orderBy` calls are additive. To order by multiple columns, call `orderBy`
       * multiple times.
       *
       * The first argument is the expression to order by and the second is the
       * order (`asc` or `desc`).
       *
       * An `order by` clause in a delete query is only supported by some dialects
       * like MySQL.
       *
       * See {@link SelectQueryBuilder.orderBy} for more examples.
       *
       * ### Examples
       *
       * Delete 5 oldest items in a table:
       *
       * ```ts
       * await db
       *   .deleteFrom('pet')
       *   .orderBy('created_at')
       *   .limit(5)
       *   .execute()
       * ```
       *
       * The generated SQL (MySQL):
       *
       * ```sql
       * delete from `pet`
       * order by `created_at`
       * limit ?
       * ```
       */
      orderBy(orderBy, direction) {
        return new _DeleteQueryBuilder({
          ...this.#props,
          queryNode: DeleteQueryNode.cloneWithOrderByItems(this.#props.queryNode, parseOrderBy([orderBy, direction]))
        });
      }
      /**
       * Adds a limit clause to the query.
       *
       * A limit clause in a delete query is only supported by some dialects
       * like MySQL.
       *
       * ### Examples
       *
       * Delete 5 oldest items in a table:
       *
       * ```ts
       * await db
       *   .deleteFrom('pet')
       *   .orderBy('created_at')
       *   .limit(5)
       *   .execute()
       * ```
       */
      limit(limit) {
        return new _DeleteQueryBuilder({
          ...this.#props,
          queryNode: DeleteQueryNode.cloneWithLimit(this.#props.queryNode, LimitNode.create(limit))
        });
      }
      /**
       * Simply calls the provided function passing `this` as the only argument. `$call` returns
       * what the provided function returns.
       *
       * If you want to conditionally call a method on `this`, see
       * the {@link $if} method.
       *
       * ### Examples
       *
       * The next example uses a helper function `log` to log a query:
       *
       * ```ts
       * function log<T extends Compilable>(qb: T): T {
       *   console.log(qb.compile())
       *   return qb
       * }
       *
       * db.deleteFrom('person')
       *   .$call(log)
       *   .execute()
       * ```
       */
      $call(func) {
        return func(this);
      }
      /**
       * Call `func(this)` if `condition` is true.
       *
       * This method is especially handy with optional selects. Any `returning` or `returningAll`
       * method calls add columns as optional fields to the output type when called inside
       * the `func` callback. This is because we can't know if those selections were actually
       * made before running the code.
       *
       * You can also call any other methods inside the callback.
       *
       * ### Examples
       *
       * ```ts
       * async function deletePerson(id: number, returnLastName: boolean) {
       *   return await db
       *     .deleteFrom('person')
       *     .where('id', '=', id)
       *     .returning(['id', 'first_name'])
       *     .$if(returnLastName, (qb) => qb.returning('last_name'))
       *     .executeTakeFirstOrThrow()
       * }
       * ```
       *
       * Any selections added inside the `if` callback will be added as optional fields to the
       * output type since we can't know if the selections were actually made before running
       * the code. In the example above the return type of the `deletePerson` function is:
       *
       * ```ts
       * {
       *   id: number
       *   first_name: string
       *   last_name?: string
       * }
       * ```
       */
      $if(condition, func) {
        if (condition) {
          return func(this);
        }
        return new _DeleteQueryBuilder({
          ...this.#props
        });
      }
      /**
       * Change the output type of the query.
       *
       * You should only use this method as the last resort if the types
       * don't support your use case.
       */
      $castTo() {
        return new _DeleteQueryBuilder(this.#props);
      }
      /**
       * Narrows (parts of) the output type of the query.
       *
       * Kysely tries to be as type-safe as possible, but in some cases we have to make
       * compromises for better maintainability and compilation performance. At present,
       * Kysely doesn't narrow the output type of the query when using {@link where} and {@link returning} or {@link returningAll}.
       *
       * This utility method is very useful for these situations, as it removes unncessary
       * runtime assertion/guard code. Its input type is limited to the output type
       * of the query, so you can't add a column that doesn't exist, or change a column's
       * type to something that doesn't exist in its union type.
       *
       * ### Examples
       *
       * Turn this code:
       *
       * ```ts
       * const person = await db.deleteFrom('person')
       *   .where('id', '=', id)
       *   .where('nullable_column', 'is not', null)
       *   .returningAll()
       *   .executeTakeFirstOrThrow()
       *
       * if (person.nullable_column) {
       *   functionThatExpectsPersonWithNonNullValue(person)
       * }
       * ```
       *
       * Into this:
       *
       * ```ts
       * const person = await db.deleteFrom('person')
       *   .where('id', '=', id)
       *   .where('nullable_column', 'is not', null)
       *   .returningAll()
       *   .$narrowType<{ nullable_column: string }>()
       *   .executeTakeFirstOrThrow()
       *
       * functionThatExpectsPersonWithNonNullValue(person)
       * ```
       */
      $narrowType() {
        return new _DeleteQueryBuilder(this.#props);
      }
      /**
       * Asserts that query's output row type equals the given type `T`.
       *
       * This method can be used to simplify excessively complex types to make typescript happy
       * and much faster.
       *
       * Kysely uses complex type magic to achieve its type safety. This complexity is sometimes too much
       * for typescript and you get errors like this:
       *
       * ```
       * error TS2589: Type instantiation is excessively deep and possibly infinite.
       * ```
       *
       * In these case you can often use this method to help typescript a little bit. When you use this
       * method to assert the output type of a query, Kysely can drop the complex output type that
       * consists of multiple nested helper types and replace it with the simple asserted type.
       *
       * Using this method doesn't reduce type safety at all. You have to pass in a type that is
       * structurally equal to the current type.
       *
       * ### Examples
       *
       * ```ts
       * const result = await db
       *   .with('deleted_person', (qb) => qb
       *     .deleteFrom('person')
       *     .where('id', '=', person.id)
       *     .returning('first_name')
       *     .$assertType<{ first_name: string }>()
       *   )
       *   .with('deleted_pet', (qb) => qb
       *     .deleteFrom('pet')
       *     .where('owner_id', '=', person.id)
       *     .returning(['name as pet_name', 'species'])
       *     .$assertType<{ pet_name: string, species: Species }>()
       *   )
       *   .selectFrom(['deleted_person', 'deleted_pet'])
       *   .selectAll()
       *   .executeTakeFirstOrThrow()
       * ```
       */
      $assertType() {
        return new _DeleteQueryBuilder(this.#props);
      }
      /**
       * Returns a copy of this DeleteQueryBuilder instance with the given plugin installed.
       */
      withPlugin(plugin) {
        return new _DeleteQueryBuilder({
          ...this.#props,
          executor: this.#props.executor.withPlugin(plugin)
        });
      }
      toOperationNode() {
        return this.#props.executor.transformQuery(this.#props.queryNode, this.#props.queryId);
      }
      compile() {
        return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
      }
      /**
       * Executes the query and returns an array of rows.
       *
       * Also see the {@link executeTakeFirst} and {@link executeTakeFirstOrThrow} methods.
       */
      async execute() {
        const compiledQuery = this.compile();
        const query = compiledQuery.query;
        const result = await this.#props.executor.executeQuery(compiledQuery, this.#props.queryId);
        if (this.#props.executor.adapter.supportsReturning && query.returning) {
          return result.rows;
        }
        return [
          new DeleteResult(
            // TODO: remove numUpdatedOrDeletedRows.
            result.numAffectedRows ?? result.numUpdatedOrDeletedRows ?? BigInt(0)
          )
        ];
      }
      /**
       * Executes the query and returns the first result or undefined if
       * the query returned no result.
       */
      async executeTakeFirst() {
        const [result] = await this.execute();
        return result;
      }
      /**
       * Executes the query and returns the first result or throws if
       * the query returned no result.
       *
       * By default an instance of {@link NoResultError} is thrown, but you can
       * provide a custom error class, or callback as the only argument to throw a different
       * error.
       */
      async executeTakeFirstOrThrow(errorConstructor = NoResultError) {
        const result = await this.executeTakeFirst();
        if (result === void 0) {
          const error = isNoResultErrorConstructor(errorConstructor) ? new errorConstructor(this.toOperationNode()) : errorConstructor(this.toOperationNode());
          throw error;
        }
        return result;
      }
      async *stream(chunkSize = 100) {
        const compiledQuery = this.compile();
        const stream = this.#props.executor.stream(compiledQuery, chunkSize, this.#props.queryId);
        for await (const item of stream) {
          yield* item.rows;
        }
      }
      async explain(format, options) {
        const builder = new _DeleteQueryBuilder({
          ...this.#props,
          queryNode: QueryNode.cloneWithExplain(this.#props.queryNode, format, options)
        });
        return await builder.execute();
      }
    };
    preventAwait(DeleteQueryBuilder, "don't await DeleteQueryBuilder instances directly. To execute the query you need to call `execute` or `executeTakeFirst`.");
  }
});

// node_modules/kysely/dist/esm/query-builder/update-result.js
var UpdateResult;
var init_update_result = __esm({
  "node_modules/kysely/dist/esm/query-builder/update-result.js"() {
    UpdateResult = class {
      numUpdatedRows;
      numChangedRows;
      constructor(numUpdatedRows, numChangedRows) {
        this.numUpdatedRows = numUpdatedRows;
        this.numChangedRows = numChangedRows;
      }
    };
  }
});

// node_modules/kysely/dist/esm/query-builder/update-query-builder.js
var UpdateQueryBuilder;
var init_update_query_builder = __esm({
  "node_modules/kysely/dist/esm/query-builder/update-query-builder.js"() {
    init_join_parser();
    init_table_parser();
    init_select_parser();
    init_query_node();
    init_update_query_node();
    init_update_set_parser();
    init_prevent_await();
    init_object_utils();
    init_update_result();
    init_no_result_error();
    init_binary_operation_parser();
    UpdateQueryBuilder = class _UpdateQueryBuilder {
      #props;
      constructor(props) {
        this.#props = freeze(props);
      }
      where(...args) {
        return new _UpdateQueryBuilder({
          ...this.#props,
          queryNode: QueryNode.cloneWithWhere(this.#props.queryNode, parseValueBinaryOperationOrExpression(args))
        });
      }
      whereRef(lhs, op, rhs) {
        return new _UpdateQueryBuilder({
          ...this.#props,
          queryNode: QueryNode.cloneWithWhere(this.#props.queryNode, parseReferentialBinaryOperation(lhs, op, rhs))
        });
      }
      clearWhere() {
        return new _UpdateQueryBuilder({
          ...this.#props,
          queryNode: QueryNode.cloneWithoutWhere(this.#props.queryNode)
        });
      }
      from(from) {
        return new _UpdateQueryBuilder({
          ...this.#props,
          queryNode: UpdateQueryNode.cloneWithFromItems(this.#props.queryNode, parseTableExpressionOrList(from))
        });
      }
      innerJoin(...args) {
        return new _UpdateQueryBuilder({
          ...this.#props,
          queryNode: QueryNode.cloneWithJoin(this.#props.queryNode, parseJoin("InnerJoin", args))
        });
      }
      leftJoin(...args) {
        return new _UpdateQueryBuilder({
          ...this.#props,
          queryNode: QueryNode.cloneWithJoin(this.#props.queryNode, parseJoin("LeftJoin", args))
        });
      }
      rightJoin(...args) {
        return new _UpdateQueryBuilder({
          ...this.#props,
          queryNode: QueryNode.cloneWithJoin(this.#props.queryNode, parseJoin("RightJoin", args))
        });
      }
      fullJoin(...args) {
        return new _UpdateQueryBuilder({
          ...this.#props,
          queryNode: QueryNode.cloneWithJoin(this.#props.queryNode, parseJoin("FullJoin", args))
        });
      }
      set(update) {
        return new _UpdateQueryBuilder({
          ...this.#props,
          queryNode: UpdateQueryNode.cloneWithUpdates(this.#props.queryNode, parseUpdateExpression(update))
        });
      }
      returning(selection) {
        return new _UpdateQueryBuilder({
          ...this.#props,
          queryNode: QueryNode.cloneWithReturning(this.#props.queryNode, parseSelectArg(selection))
        });
      }
      returningAll() {
        return new _UpdateQueryBuilder({
          ...this.#props,
          queryNode: QueryNode.cloneWithReturning(this.#props.queryNode, parseSelectAll())
        });
      }
      /**
       * Simply calls the provided function passing `this` as the only argument. `$call` returns
       * what the provided function returns.
       *
       * If you want to conditionally call a method on `this`, see
       * the {@link $if} method.
       *
       * ### Examples
       *
       * The next example uses a helper function `log` to log a query:
       *
       * ```ts
       * function log<T extends Compilable>(qb: T): T {
       *   console.log(qb.compile())
       *   return qb
       * }
       *
       * db.updateTable('person')
       *   .set(values)
       *   .$call(log)
       *   .execute()
       * ```
       */
      $call(func) {
        return func(this);
      }
      /**
       * Call `func(this)` if `condition` is true.
       *
       * This method is especially handy with optional selects. Any `returning` or `returningAll`
       * method calls add columns as optional fields to the output type when called inside
       * the `func` callback. This is because we can't know if those selections were actually
       * made before running the code.
       *
       * You can also call any other methods inside the callback.
       *
       * ### Examples
       *
       * ```ts
       * async function updatePerson(id: number, updates: UpdateablePerson, returnLastName: boolean) {
       *   return await db
       *     .updateTable('person')
       *     .set(updates)
       *     .where('id', '=', id)
       *     .returning(['id', 'first_name'])
       *     .$if(returnLastName, (qb) => qb.returning('last_name'))
       *     .executeTakeFirstOrThrow()
       * }
       * ```
       *
       * Any selections added inside the `if` callback will be added as optional fields to the
       * output type since we can't know if the selections were actually made before running
       * the code. In the example above the return type of the `updatePerson` function is:
       *
       * ```ts
       * {
       *   id: number
       *   first_name: string
       *   last_name?: string
       * }
       * ```
       */
      $if(condition, func) {
        if (condition) {
          return func(this);
        }
        return new _UpdateQueryBuilder({
          ...this.#props
        });
      }
      /**
       * Change the output type of the query.
       *
       * You should only use this method as the last resort if the types
       * don't support your use case.
       */
      $castTo() {
        return new _UpdateQueryBuilder(this.#props);
      }
      /**
       * Narrows (parts of) the output type of the query.
       *
       * Kysely tries to be as type-safe as possible, but in some cases we have to make
       * compromises for better maintainability and compilation performance. At present,
       * Kysely doesn't narrow the output type of the query based on {@link set} input
       * when using {@link where} and/or {@link returning} or {@link returningAll}.
       *
       * This utility method is very useful for these situations, as it removes unncessary
       * runtime assertion/guard code. Its input type is limited to the output type
       * of the query, so you can't add a column that doesn't exist, or change a column's
       * type to something that doesn't exist in its union type.
       *
       * ### Examples
       *
       * Turn this code:
       *
       * ```ts
       * const person = await db.updateTable('person')
       *   .set({ deletedAt: now })
       *   .where('id', '=', id)
       *   .where('nullable_column', 'is not', null)
       *   .returningAll()
       *   .executeTakeFirstOrThrow()
       *
       * if (person.nullable_column) {
       *   functionThatExpectsPersonWithNonNullValue(person)
       * }
       * ```
       *
       * Into this:
       *
       * ```ts
       * const person = await db.updateTable('person')
       *   .set({ deletedAt: now })
       *   .where('id', '=', id)
       *   .where('nullable_column', 'is not', null)
       *   .returningAll()
       *   .$narrowType<{ deletedAt: Date; nullable_column: string }>()
       *   .executeTakeFirstOrThrow()
       *
       * functionThatExpectsPersonWithNonNullValue(person)
       * ```
       */
      $narrowType() {
        return new _UpdateQueryBuilder(this.#props);
      }
      /**
       * Asserts that query's output row type equals the given type `T`.
       *
       * This method can be used to simplify excessively complex types to make typescript happy
       * and much faster.
       *
       * Kysely uses complex type magic to achieve its type safety. This complexity is sometimes too much
       * for typescript and you get errors like this:
       *
       * ```
       * error TS2589: Type instantiation is excessively deep and possibly infinite.
       * ```
       *
       * In these case you can often use this method to help typescript a little bit. When you use this
       * method to assert the output type of a query, Kysely can drop the complex output type that
       * consists of multiple nested helper types and replace it with the simple asserted type.
       *
       * Using this method doesn't reduce type safety at all. You have to pass in a type that is
       * structurally equal to the current type.
       *
       * ### Examples
       *
       * ```ts
       * const result = await db
       *   .with('updated_person', (qb) => qb
       *     .updateTable('person')
       *     .set(person)
       *     .where('id', '=', person.id)
       *     .returning('first_name')
       *     .$assertType<{ first_name: string }>()
       *   )
       *   .with('updated_pet', (qb) => qb
       *     .updateTable('pet')
       *     .set(pet)
       *     .where('owner_id', '=', person.id)
       *     .returning(['name as pet_name', 'species'])
       *     .$assertType<{ pet_name: string, species: Species }>()
       *   )
       *   .selectFrom(['updated_person', 'updated_pet'])
       *   .selectAll()
       *   .executeTakeFirstOrThrow()
       * ```
       */
      $assertType() {
        return new _UpdateQueryBuilder(this.#props);
      }
      /**
       * Returns a copy of this UpdateQueryBuilder instance with the given plugin installed.
       */
      withPlugin(plugin) {
        return new _UpdateQueryBuilder({
          ...this.#props,
          executor: this.#props.executor.withPlugin(plugin)
        });
      }
      toOperationNode() {
        return this.#props.executor.transformQuery(this.#props.queryNode, this.#props.queryId);
      }
      compile() {
        return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
      }
      /**
       * Executes the query and returns an array of rows.
       *
       * Also see the {@link executeTakeFirst} and {@link executeTakeFirstOrThrow} methods.
       */
      async execute() {
        const compiledQuery = this.compile();
        const query = compiledQuery.query;
        const result = await this.#props.executor.executeQuery(compiledQuery, this.#props.queryId);
        if (this.#props.executor.adapter.supportsReturning && query.returning) {
          return result.rows;
        }
        return [
          new UpdateResult(
            // TODO: remove numUpdatedOrDeletedRows.
            // TODO: https://github.com/kysely-org/kysely/pull/431#discussion_r1172330899
            result.numAffectedRows ?? result.numUpdatedOrDeletedRows ?? BigInt(0),
            result.numChangedRows
          )
        ];
      }
      /**
       * Executes the query and returns the first result or undefined if
       * the query returned no result.
       */
      async executeTakeFirst() {
        const [result] = await this.execute();
        return result;
      }
      /**
       * Executes the query and returns the first result or throws if
       * the query returned no result.
       *
       * By default an instance of {@link NoResultError} is thrown, but you can
       * provide a custom error class, or callback as the only argument to throw a different
       * error.
       */
      async executeTakeFirstOrThrow(errorConstructor = NoResultError) {
        const result = await this.executeTakeFirst();
        if (result === void 0) {
          const error = isNoResultErrorConstructor(errorConstructor) ? new errorConstructor(this.toOperationNode()) : errorConstructor(this.toOperationNode());
          throw error;
        }
        return result;
      }
      async *stream(chunkSize = 100) {
        const compiledQuery = this.compile();
        const stream = this.#props.executor.stream(compiledQuery, chunkSize, this.#props.queryId);
        for await (const item of stream) {
          yield* item.rows;
        }
      }
      async explain(format, options) {
        const builder = new _UpdateQueryBuilder({
          ...this.#props,
          queryNode: QueryNode.cloneWithExplain(this.#props.queryNode, format, options)
        });
        return await builder.execute();
      }
    };
    preventAwait(UpdateQueryBuilder, "don't await UpdateQueryBuilder instances directly. To execute the query you need to call `execute` or `executeTakeFirst`.");
  }
});

// node_modules/kysely/dist/esm/operation-node/common-table-expression-name-node.js
var CommonTableExpressionNameNode;
var init_common_table_expression_name_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/common-table-expression-name-node.js"() {
    init_object_utils();
    init_column_node();
    init_table_node();
    CommonTableExpressionNameNode = freeze({
      is(node) {
        return node.kind === "CommonTableExpressionNameNode";
      },
      create(tableName, columnNames) {
        return freeze({
          kind: "CommonTableExpressionNameNode",
          table: TableNode.create(tableName),
          columns: columnNames ? freeze(columnNames.map(ColumnNode.create)) : void 0
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/common-table-expression-node.js
var CommonTableExpressionNode;
var init_common_table_expression_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/common-table-expression-node.js"() {
    init_object_utils();
    CommonTableExpressionNode = freeze({
      is(node) {
        return node.kind === "CommonTableExpressionNode";
      },
      create(name, expression) {
        return freeze({
          kind: "CommonTableExpressionNode",
          name,
          expression
        });
      },
      cloneWith(node, props) {
        return freeze({
          ...node,
          ...props
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/query-builder/cte-builder.js
var CTEBuilder;
var init_cte_builder = __esm({
  "node_modules/kysely/dist/esm/query-builder/cte-builder.js"() {
    init_common_table_expression_node();
    init_prevent_await();
    init_object_utils();
    CTEBuilder = class _CTEBuilder {
      #props;
      constructor(props) {
        this.#props = freeze(props);
      }
      /**
       * Makes the common table expression materialized.
       */
      materialized() {
        return new _CTEBuilder({
          ...this.#props,
          node: CommonTableExpressionNode.cloneWith(this.#props.node, {
            materialized: true
          })
        });
      }
      /**
       * Makes the common table expression not materialized.
       */
      notMaterialized() {
        return new _CTEBuilder({
          ...this.#props,
          node: CommonTableExpressionNode.cloneWith(this.#props.node, {
            materialized: false
          })
        });
      }
      toOperationNode() {
        return this.#props.node;
      }
    };
    preventAwait(CTEBuilder, "don't await CTEBuilder instances. They are never executed directly and are always just a part of a query.");
  }
});

// node_modules/kysely/dist/esm/parser/with-parser.js
function parseCommonTableExpression(nameOrBuilderCallback, expression) {
  const expressionNode = expression(createQueryCreator()).toOperationNode();
  if (isFunction(nameOrBuilderCallback)) {
    return nameOrBuilderCallback(cteBuilderFactory(expressionNode)).toOperationNode();
  }
  return CommonTableExpressionNode.create(parseCommonTableExpressionName(nameOrBuilderCallback), expressionNode);
}
function cteBuilderFactory(expressionNode) {
  return (name) => {
    return new CTEBuilder({
      node: CommonTableExpressionNode.create(parseCommonTableExpressionName(name), expressionNode)
    });
  };
}
function parseCommonTableExpressionName(name) {
  if (name.includes("(")) {
    const parts = name.split(/[\(\)]/);
    const table = parts[0];
    const columns = parts[1].split(",").map((it) => it.trim());
    return CommonTableExpressionNameNode.create(table, columns);
  } else {
    return CommonTableExpressionNameNode.create(name);
  }
}
var init_with_parser = __esm({
  "node_modules/kysely/dist/esm/parser/with-parser.js"() {
    init_common_table_expression_name_node();
    init_parse_utils();
    init_object_utils();
    init_cte_builder();
    init_common_table_expression_node();
  }
});

// node_modules/kysely/dist/esm/operation-node/with-node.js
var WithNode;
var init_with_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/with-node.js"() {
    init_object_utils();
    WithNode = freeze({
      is(node) {
        return node.kind === "WithNode";
      },
      create(expression, params) {
        return freeze({
          kind: "WithNode",
          expressions: freeze([expression]),
          ...params
        });
      },
      cloneWithExpression(withNode, expression) {
        return freeze({
          ...withNode,
          expressions: freeze([...withNode.expressions, expression])
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/util/random-string.js
function randomString(length) {
  let chars = "";
  for (let i = 0; i < length; ++i) {
    chars += randomChar();
  }
  return chars;
}
function randomChar() {
  return CHARS[~~(Math.random() * CHARS.length)];
}
var CHARS;
var init_random_string = __esm({
  "node_modules/kysely/dist/esm/util/random-string.js"() {
    CHARS = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9"
    ];
  }
});

// node_modules/kysely/dist/esm/util/query-id.js
function createQueryId() {
  return new LazyQueryId();
}
var LazyQueryId;
var init_query_id = __esm({
  "node_modules/kysely/dist/esm/util/query-id.js"() {
    init_random_string();
    LazyQueryId = class {
      #queryId;
      get queryId() {
        if (this.#queryId === void 0) {
          this.#queryId = randomString(8);
        }
        return this.#queryId;
      }
    };
  }
});

// node_modules/kysely/dist/esm/util/require-all-props.js
function requireAllProps(obj) {
  return obj;
}
var init_require_all_props = __esm({
  "node_modules/kysely/dist/esm/util/require-all-props.js"() {
  }
});

// node_modules/kysely/dist/esm/operation-node/operation-node-transformer.js
var OperationNodeTransformer;
var init_operation_node_transformer = __esm({
  "node_modules/kysely/dist/esm/operation-node/operation-node-transformer.js"() {
    init_object_utils();
    init_require_all_props();
    OperationNodeTransformer = class {
      nodeStack = [];
      #transformers = freeze({
        AliasNode: this.transformAlias.bind(this),
        ColumnNode: this.transformColumn.bind(this),
        IdentifierNode: this.transformIdentifier.bind(this),
        SchemableIdentifierNode: this.transformSchemableIdentifier.bind(this),
        RawNode: this.transformRaw.bind(this),
        ReferenceNode: this.transformReference.bind(this),
        SelectQueryNode: this.transformSelectQuery.bind(this),
        SelectionNode: this.transformSelection.bind(this),
        TableNode: this.transformTable.bind(this),
        FromNode: this.transformFrom.bind(this),
        SelectAllNode: this.transformSelectAll.bind(this),
        AndNode: this.transformAnd.bind(this),
        OrNode: this.transformOr.bind(this),
        ValueNode: this.transformValue.bind(this),
        ValueListNode: this.transformValueList.bind(this),
        PrimitiveValueListNode: this.transformPrimitiveValueList.bind(this),
        ParensNode: this.transformParens.bind(this),
        JoinNode: this.transformJoin.bind(this),
        OperatorNode: this.transformOperator.bind(this),
        WhereNode: this.transformWhere.bind(this),
        InsertQueryNode: this.transformInsertQuery.bind(this),
        DeleteQueryNode: this.transformDeleteQuery.bind(this),
        ReturningNode: this.transformReturning.bind(this),
        CreateTableNode: this.transformCreateTable.bind(this),
        AddColumnNode: this.transformAddColumn.bind(this),
        ColumnDefinitionNode: this.transformColumnDefinition.bind(this),
        DropTableNode: this.transformDropTable.bind(this),
        DataTypeNode: this.transformDataType.bind(this),
        OrderByNode: this.transformOrderBy.bind(this),
        OrderByItemNode: this.transformOrderByItem.bind(this),
        GroupByNode: this.transformGroupBy.bind(this),
        GroupByItemNode: this.transformGroupByItem.bind(this),
        UpdateQueryNode: this.transformUpdateQuery.bind(this),
        ColumnUpdateNode: this.transformColumnUpdate.bind(this),
        LimitNode: this.transformLimit.bind(this),
        OffsetNode: this.transformOffset.bind(this),
        OnConflictNode: this.transformOnConflict.bind(this),
        OnDuplicateKeyNode: this.transformOnDuplicateKey.bind(this),
        CreateIndexNode: this.transformCreateIndex.bind(this),
        DropIndexNode: this.transformDropIndex.bind(this),
        ListNode: this.transformList.bind(this),
        PrimaryKeyConstraintNode: this.transformPrimaryKeyConstraint.bind(this),
        UniqueConstraintNode: this.transformUniqueConstraint.bind(this),
        ReferencesNode: this.transformReferences.bind(this),
        CheckConstraintNode: this.transformCheckConstraint.bind(this),
        WithNode: this.transformWith.bind(this),
        CommonTableExpressionNode: this.transformCommonTableExpression.bind(this),
        CommonTableExpressionNameNode: this.transformCommonTableExpressionName.bind(this),
        HavingNode: this.transformHaving.bind(this),
        CreateSchemaNode: this.transformCreateSchema.bind(this),
        DropSchemaNode: this.transformDropSchema.bind(this),
        AlterTableNode: this.transformAlterTable.bind(this),
        DropColumnNode: this.transformDropColumn.bind(this),
        RenameColumnNode: this.transformRenameColumn.bind(this),
        AlterColumnNode: this.transformAlterColumn.bind(this),
        ModifyColumnNode: this.transformModifyColumn.bind(this),
        AddConstraintNode: this.transformAddConstraint.bind(this),
        DropConstraintNode: this.transformDropConstraint.bind(this),
        ForeignKeyConstraintNode: this.transformForeignKeyConstraint.bind(this),
        CreateViewNode: this.transformCreateView.bind(this),
        DropViewNode: this.transformDropView.bind(this),
        GeneratedNode: this.transformGenerated.bind(this),
        DefaultValueNode: this.transformDefaultValue.bind(this),
        OnNode: this.transformOn.bind(this),
        ValuesNode: this.transformValues.bind(this),
        SelectModifierNode: this.transformSelectModifier.bind(this),
        CreateTypeNode: this.transformCreateType.bind(this),
        DropTypeNode: this.transformDropType.bind(this),
        ExplainNode: this.transformExplain.bind(this),
        DefaultInsertValueNode: this.transformDefaultInsertValue.bind(this),
        AggregateFunctionNode: this.transformAggregateFunction.bind(this),
        OverNode: this.transformOver.bind(this),
        PartitionByNode: this.transformPartitionBy.bind(this),
        PartitionByItemNode: this.transformPartitionByItem.bind(this),
        SetOperationNode: this.transformSetOperation.bind(this),
        BinaryOperationNode: this.transformBinaryOperation.bind(this),
        UnaryOperationNode: this.transformUnaryOperation.bind(this),
        UsingNode: this.transformUsing.bind(this),
        FunctionNode: this.transformFunction.bind(this),
        CaseNode: this.transformCase.bind(this),
        WhenNode: this.transformWhen.bind(this),
        JSONReferenceNode: this.transformJSONReference.bind(this),
        JSONPathNode: this.transformJSONPath.bind(this),
        JSONPathLegNode: this.transformJSONPathLeg.bind(this),
        JSONOperatorChainNode: this.transformJSONOperatorChain.bind(this),
        TupleNode: this.transformTuple.bind(this)
      });
      transformNode(node) {
        if (!node) {
          return node;
        }
        this.nodeStack.push(node);
        const out = this.transformNodeImpl(node);
        this.nodeStack.pop();
        return freeze(out);
      }
      transformNodeImpl(node) {
        return this.#transformers[node.kind](node);
      }
      transformNodeList(list) {
        if (!list) {
          return list;
        }
        return freeze(list.map((node) => this.transformNode(node)));
      }
      transformSelectQuery(node) {
        return requireAllProps({
          kind: "SelectQueryNode",
          from: this.transformNode(node.from),
          selections: this.transformNodeList(node.selections),
          distinctOn: this.transformNodeList(node.distinctOn),
          joins: this.transformNodeList(node.joins),
          groupBy: this.transformNode(node.groupBy),
          orderBy: this.transformNode(node.orderBy),
          where: this.transformNode(node.where),
          frontModifiers: this.transformNodeList(node.frontModifiers),
          endModifiers: this.transformNodeList(node.endModifiers),
          limit: this.transformNode(node.limit),
          offset: this.transformNode(node.offset),
          with: this.transformNode(node.with),
          having: this.transformNode(node.having),
          explain: this.transformNode(node.explain),
          setOperations: this.transformNodeList(node.setOperations)
        });
      }
      transformSelection(node) {
        return requireAllProps({
          kind: "SelectionNode",
          selection: this.transformNode(node.selection)
        });
      }
      transformColumn(node) {
        return requireAllProps({
          kind: "ColumnNode",
          column: this.transformNode(node.column)
        });
      }
      transformAlias(node) {
        return requireAllProps({
          kind: "AliasNode",
          node: this.transformNode(node.node),
          alias: this.transformNode(node.alias)
        });
      }
      transformTable(node) {
        return requireAllProps({
          kind: "TableNode",
          table: this.transformNode(node.table)
        });
      }
      transformFrom(node) {
        return requireAllProps({
          kind: "FromNode",
          froms: this.transformNodeList(node.froms)
        });
      }
      transformReference(node) {
        return requireAllProps({
          kind: "ReferenceNode",
          column: this.transformNode(node.column),
          table: this.transformNode(node.table)
        });
      }
      transformAnd(node) {
        return requireAllProps({
          kind: "AndNode",
          left: this.transformNode(node.left),
          right: this.transformNode(node.right)
        });
      }
      transformOr(node) {
        return requireAllProps({
          kind: "OrNode",
          left: this.transformNode(node.left),
          right: this.transformNode(node.right)
        });
      }
      transformValueList(node) {
        return requireAllProps({
          kind: "ValueListNode",
          values: this.transformNodeList(node.values)
        });
      }
      transformParens(node) {
        return requireAllProps({
          kind: "ParensNode",
          node: this.transformNode(node.node)
        });
      }
      transformJoin(node) {
        return requireAllProps({
          kind: "JoinNode",
          joinType: node.joinType,
          table: this.transformNode(node.table),
          on: this.transformNode(node.on)
        });
      }
      transformRaw(node) {
        return requireAllProps({
          kind: "RawNode",
          sqlFragments: freeze([...node.sqlFragments]),
          parameters: this.transformNodeList(node.parameters)
        });
      }
      transformWhere(node) {
        return requireAllProps({
          kind: "WhereNode",
          where: this.transformNode(node.where)
        });
      }
      transformInsertQuery(node) {
        return requireAllProps({
          kind: "InsertQueryNode",
          into: this.transformNode(node.into),
          columns: this.transformNodeList(node.columns),
          values: this.transformNode(node.values),
          returning: this.transformNode(node.returning),
          onConflict: this.transformNode(node.onConflict),
          onDuplicateKey: this.transformNode(node.onDuplicateKey),
          with: this.transformNode(node.with),
          ignore: node.ignore,
          replace: node.replace,
          explain: this.transformNode(node.explain)
        });
      }
      transformValues(node) {
        return requireAllProps({
          kind: "ValuesNode",
          values: this.transformNodeList(node.values)
        });
      }
      transformDeleteQuery(node) {
        return requireAllProps({
          kind: "DeleteQueryNode",
          from: this.transformNode(node.from),
          using: this.transformNode(node.using),
          joins: this.transformNodeList(node.joins),
          where: this.transformNode(node.where),
          returning: this.transformNode(node.returning),
          with: this.transformNode(node.with),
          orderBy: this.transformNode(node.orderBy),
          limit: this.transformNode(node.limit),
          explain: this.transformNode(node.explain)
        });
      }
      transformReturning(node) {
        return requireAllProps({
          kind: "ReturningNode",
          selections: this.transformNodeList(node.selections)
        });
      }
      transformCreateTable(node) {
        return requireAllProps({
          kind: "CreateTableNode",
          table: this.transformNode(node.table),
          columns: this.transformNodeList(node.columns),
          constraints: this.transformNodeList(node.constraints),
          temporary: node.temporary,
          ifNotExists: node.ifNotExists,
          onCommit: node.onCommit,
          frontModifiers: this.transformNodeList(node.frontModifiers),
          endModifiers: this.transformNodeList(node.endModifiers)
        });
      }
      transformColumnDefinition(node) {
        return requireAllProps({
          kind: "ColumnDefinitionNode",
          column: this.transformNode(node.column),
          dataType: this.transformNode(node.dataType),
          references: this.transformNode(node.references),
          primaryKey: node.primaryKey,
          autoIncrement: node.autoIncrement,
          unique: node.unique,
          notNull: node.notNull,
          unsigned: node.unsigned,
          defaultTo: this.transformNode(node.defaultTo),
          check: this.transformNode(node.check),
          generated: this.transformNode(node.generated),
          frontModifiers: this.transformNodeList(node.frontModifiers),
          endModifiers: this.transformNodeList(node.endModifiers)
        });
      }
      transformAddColumn(node) {
        return requireAllProps({
          kind: "AddColumnNode",
          column: this.transformNode(node.column)
        });
      }
      transformDropTable(node) {
        return requireAllProps({
          kind: "DropTableNode",
          table: this.transformNode(node.table),
          ifExists: node.ifExists,
          cascade: node.cascade
        });
      }
      transformOrderBy(node) {
        return requireAllProps({
          kind: "OrderByNode",
          items: this.transformNodeList(node.items)
        });
      }
      transformOrderByItem(node) {
        return requireAllProps({
          kind: "OrderByItemNode",
          orderBy: this.transformNode(node.orderBy),
          direction: this.transformNode(node.direction)
        });
      }
      transformGroupBy(node) {
        return requireAllProps({
          kind: "GroupByNode",
          items: this.transformNodeList(node.items)
        });
      }
      transformGroupByItem(node) {
        return requireAllProps({
          kind: "GroupByItemNode",
          groupBy: this.transformNode(node.groupBy)
        });
      }
      transformUpdateQuery(node) {
        return requireAllProps({
          kind: "UpdateQueryNode",
          table: this.transformNode(node.table),
          from: this.transformNode(node.from),
          joins: this.transformNodeList(node.joins),
          where: this.transformNode(node.where),
          updates: this.transformNodeList(node.updates),
          returning: this.transformNode(node.returning),
          with: this.transformNode(node.with),
          explain: this.transformNode(node.explain)
        });
      }
      transformColumnUpdate(node) {
        return requireAllProps({
          kind: "ColumnUpdateNode",
          column: this.transformNode(node.column),
          value: this.transformNode(node.value)
        });
      }
      transformLimit(node) {
        return requireAllProps({
          kind: "LimitNode",
          limit: this.transformNode(node.limit)
        });
      }
      transformOffset(node) {
        return requireAllProps({
          kind: "OffsetNode",
          offset: this.transformNode(node.offset)
        });
      }
      transformOnConflict(node) {
        return requireAllProps({
          kind: "OnConflictNode",
          columns: this.transformNodeList(node.columns),
          constraint: this.transformNode(node.constraint),
          indexExpression: this.transformNode(node.indexExpression),
          indexWhere: this.transformNode(node.indexWhere),
          updates: this.transformNodeList(node.updates),
          updateWhere: this.transformNode(node.updateWhere),
          doNothing: node.doNothing
        });
      }
      transformOnDuplicateKey(node) {
        return requireAllProps({
          kind: "OnDuplicateKeyNode",
          updates: this.transformNodeList(node.updates)
        });
      }
      transformCreateIndex(node) {
        return requireAllProps({
          kind: "CreateIndexNode",
          name: this.transformNode(node.name),
          table: this.transformNode(node.table),
          columns: this.transformNodeList(node.columns),
          unique: node.unique,
          using: this.transformNode(node.using),
          ifNotExists: node.ifNotExists,
          where: this.transformNode(node.where)
        });
      }
      transformList(node) {
        return requireAllProps({
          kind: "ListNode",
          items: this.transformNodeList(node.items)
        });
      }
      transformDropIndex(node) {
        return requireAllProps({
          kind: "DropIndexNode",
          name: this.transformNode(node.name),
          table: this.transformNode(node.table),
          ifExists: node.ifExists,
          cascade: node.cascade
        });
      }
      transformPrimaryKeyConstraint(node) {
        return requireAllProps({
          kind: "PrimaryKeyConstraintNode",
          columns: this.transformNodeList(node.columns),
          name: this.transformNode(node.name)
        });
      }
      transformUniqueConstraint(node) {
        return requireAllProps({
          kind: "UniqueConstraintNode",
          columns: this.transformNodeList(node.columns),
          name: this.transformNode(node.name)
        });
      }
      transformForeignKeyConstraint(node) {
        return requireAllProps({
          kind: "ForeignKeyConstraintNode",
          columns: this.transformNodeList(node.columns),
          references: this.transformNode(node.references),
          name: this.transformNode(node.name),
          onDelete: node.onDelete,
          onUpdate: node.onUpdate
        });
      }
      transformSetOperation(node) {
        return requireAllProps({
          kind: "SetOperationNode",
          operator: node.operator,
          expression: this.transformNode(node.expression),
          all: node.all
        });
      }
      transformReferences(node) {
        return requireAllProps({
          kind: "ReferencesNode",
          table: this.transformNode(node.table),
          columns: this.transformNodeList(node.columns),
          onDelete: node.onDelete,
          onUpdate: node.onUpdate
        });
      }
      transformCheckConstraint(node) {
        return requireAllProps({
          kind: "CheckConstraintNode",
          expression: this.transformNode(node.expression),
          name: this.transformNode(node.name)
        });
      }
      transformWith(node) {
        return requireAllProps({
          kind: "WithNode",
          expressions: this.transformNodeList(node.expressions),
          recursive: node.recursive
        });
      }
      transformCommonTableExpression(node) {
        return requireAllProps({
          kind: "CommonTableExpressionNode",
          name: this.transformNode(node.name),
          materialized: node.materialized,
          expression: this.transformNode(node.expression)
        });
      }
      transformCommonTableExpressionName(node) {
        return requireAllProps({
          kind: "CommonTableExpressionNameNode",
          table: this.transformNode(node.table),
          columns: this.transformNodeList(node.columns)
        });
      }
      transformHaving(node) {
        return requireAllProps({
          kind: "HavingNode",
          having: this.transformNode(node.having)
        });
      }
      transformCreateSchema(node) {
        return requireAllProps({
          kind: "CreateSchemaNode",
          schema: this.transformNode(node.schema),
          ifNotExists: node.ifNotExists
        });
      }
      transformDropSchema(node) {
        return requireAllProps({
          kind: "DropSchemaNode",
          schema: this.transformNode(node.schema),
          ifExists: node.ifExists,
          cascade: node.cascade
        });
      }
      transformAlterTable(node) {
        return requireAllProps({
          kind: "AlterTableNode",
          table: this.transformNode(node.table),
          renameTo: this.transformNode(node.renameTo),
          setSchema: this.transformNode(node.setSchema),
          columnAlterations: this.transformNodeList(node.columnAlterations),
          addConstraint: this.transformNode(node.addConstraint),
          dropConstraint: this.transformNode(node.dropConstraint)
        });
      }
      transformDropColumn(node) {
        return requireAllProps({
          kind: "DropColumnNode",
          column: this.transformNode(node.column)
        });
      }
      transformRenameColumn(node) {
        return requireAllProps({
          kind: "RenameColumnNode",
          column: this.transformNode(node.column),
          renameTo: this.transformNode(node.renameTo)
        });
      }
      transformAlterColumn(node) {
        return requireAllProps({
          kind: "AlterColumnNode",
          column: this.transformNode(node.column),
          dataType: this.transformNode(node.dataType),
          dataTypeExpression: this.transformNode(node.dataTypeExpression),
          setDefault: this.transformNode(node.setDefault),
          dropDefault: node.dropDefault,
          setNotNull: node.setNotNull,
          dropNotNull: node.dropNotNull
        });
      }
      transformModifyColumn(node) {
        return requireAllProps({
          kind: "ModifyColumnNode",
          column: this.transformNode(node.column)
        });
      }
      transformAddConstraint(node) {
        return requireAllProps({
          kind: "AddConstraintNode",
          constraint: this.transformNode(node.constraint)
        });
      }
      transformDropConstraint(node) {
        return requireAllProps({
          kind: "DropConstraintNode",
          constraintName: this.transformNode(node.constraintName),
          ifExists: node.ifExists,
          modifier: node.modifier
        });
      }
      transformCreateView(node) {
        return requireAllProps({
          kind: "CreateViewNode",
          name: this.transformNode(node.name),
          temporary: node.temporary,
          orReplace: node.orReplace,
          ifNotExists: node.ifNotExists,
          materialized: node.materialized,
          columns: this.transformNodeList(node.columns),
          as: this.transformNode(node.as)
        });
      }
      transformDropView(node) {
        return requireAllProps({
          kind: "DropViewNode",
          name: this.transformNode(node.name),
          ifExists: node.ifExists,
          materialized: node.materialized,
          cascade: node.cascade
        });
      }
      transformGenerated(node) {
        return requireAllProps({
          kind: "GeneratedNode",
          byDefault: node.byDefault,
          always: node.always,
          identity: node.identity,
          stored: node.stored,
          expression: this.transformNode(node.expression)
        });
      }
      transformDefaultValue(node) {
        return requireAllProps({
          kind: "DefaultValueNode",
          defaultValue: this.transformNode(node.defaultValue)
        });
      }
      transformOn(node) {
        return requireAllProps({
          kind: "OnNode",
          on: this.transformNode(node.on)
        });
      }
      transformSelectModifier(node) {
        return requireAllProps({
          kind: "SelectModifierNode",
          modifier: node.modifier,
          rawModifier: this.transformNode(node.rawModifier)
        });
      }
      transformCreateType(node) {
        return requireAllProps({
          kind: "CreateTypeNode",
          name: this.transformNode(node.name),
          enum: this.transformNode(node.enum)
        });
      }
      transformDropType(node) {
        return requireAllProps({
          kind: "DropTypeNode",
          name: this.transformNode(node.name),
          ifExists: node.ifExists
        });
      }
      transformExplain(node) {
        return requireAllProps({
          kind: "ExplainNode",
          format: node.format,
          options: this.transformNode(node.options)
        });
      }
      transformSchemableIdentifier(node) {
        return requireAllProps({
          kind: "SchemableIdentifierNode",
          schema: this.transformNode(node.schema),
          identifier: this.transformNode(node.identifier)
        });
      }
      transformAggregateFunction(node) {
        return requireAllProps({
          kind: "AggregateFunctionNode",
          aggregated: this.transformNodeList(node.aggregated),
          distinct: node.distinct,
          filter: this.transformNode(node.filter),
          func: node.func,
          over: this.transformNode(node.over)
        });
      }
      transformOver(node) {
        return requireAllProps({
          kind: "OverNode",
          orderBy: this.transformNode(node.orderBy),
          partitionBy: this.transformNode(node.partitionBy)
        });
      }
      transformPartitionBy(node) {
        return requireAllProps({
          kind: "PartitionByNode",
          items: this.transformNodeList(node.items)
        });
      }
      transformPartitionByItem(node) {
        return requireAllProps({
          kind: "PartitionByItemNode",
          partitionBy: this.transformNode(node.partitionBy)
        });
      }
      transformBinaryOperation(node) {
        return requireAllProps({
          kind: "BinaryOperationNode",
          leftOperand: this.transformNode(node.leftOperand),
          operator: this.transformNode(node.operator),
          rightOperand: this.transformNode(node.rightOperand)
        });
      }
      transformUnaryOperation(node) {
        return requireAllProps({
          kind: "UnaryOperationNode",
          operator: this.transformNode(node.operator),
          operand: this.transformNode(node.operand)
        });
      }
      transformUsing(node) {
        return requireAllProps({
          kind: "UsingNode",
          tables: this.transformNodeList(node.tables)
        });
      }
      transformFunction(node) {
        return requireAllProps({
          kind: "FunctionNode",
          func: node.func,
          arguments: this.transformNodeList(node.arguments)
        });
      }
      transformCase(node) {
        return requireAllProps({
          kind: "CaseNode",
          value: this.transformNode(node.value),
          when: this.transformNodeList(node.when),
          else: this.transformNode(node.else),
          isStatement: node.isStatement
        });
      }
      transformWhen(node) {
        return requireAllProps({
          kind: "WhenNode",
          condition: this.transformNode(node.condition),
          result: this.transformNode(node.result)
        });
      }
      transformJSONReference(node) {
        return requireAllProps({
          kind: "JSONReferenceNode",
          reference: this.transformNode(node.reference),
          traversal: this.transformNode(node.traversal)
        });
      }
      transformJSONPath(node) {
        return requireAllProps({
          kind: "JSONPathNode",
          inOperator: this.transformNode(node.inOperator),
          pathLegs: this.transformNodeList(node.pathLegs)
        });
      }
      transformJSONPathLeg(node) {
        return requireAllProps({
          kind: "JSONPathLegNode",
          type: node.type,
          value: node.value
        });
      }
      transformJSONOperatorChain(node) {
        return requireAllProps({
          kind: "JSONOperatorChainNode",
          operator: this.transformNode(node.operator),
          values: this.transformNodeList(node.values)
        });
      }
      transformTuple(node) {
        return requireAllProps({
          kind: "TupleNode",
          values: this.transformNodeList(node.values)
        });
      }
      transformDataType(node) {
        return node;
      }
      transformSelectAll(node) {
        return node;
      }
      transformIdentifier(node) {
        return node;
      }
      transformValue(node) {
        return node;
      }
      transformPrimitiveValueList(node) {
        return node;
      }
      transformOperator(node) {
        return node;
      }
      transformDefaultInsertValue(node) {
        return node;
      }
    };
  }
});

// node_modules/kysely/dist/esm/plugin/with-schema/with-schema-transformer.js
var ROOT_OPERATION_NODES, WithSchemaTransformer;
var init_with_schema_transformer = __esm({
  "node_modules/kysely/dist/esm/plugin/with-schema/with-schema-transformer.js"() {
    init_alias_node();
    init_identifier_node();
    init_operation_node_transformer();
    init_schemable_identifier_node();
    init_table_node();
    init_object_utils();
    ROOT_OPERATION_NODES = freeze({
      AlterTableNode: true,
      CreateIndexNode: true,
      CreateSchemaNode: true,
      CreateTableNode: true,
      CreateTypeNode: true,
      CreateViewNode: true,
      DeleteQueryNode: true,
      DropIndexNode: true,
      DropSchemaNode: true,
      DropTableNode: true,
      DropTypeNode: true,
      DropViewNode: true,
      InsertQueryNode: true,
      RawNode: true,
      SelectQueryNode: true,
      UpdateQueryNode: true
    });
    WithSchemaTransformer = class extends OperationNodeTransformer {
      #schema;
      #schemableIds = /* @__PURE__ */ new Set();
      #ctes = /* @__PURE__ */ new Set();
      constructor(schema9) {
        super();
        this.#schema = schema9;
      }
      transformNodeImpl(node) {
        if (!this.#isRootOperationNode(node)) {
          return super.transformNodeImpl(node);
        }
        const ctes = this.#collectCTEs(node);
        for (const cte of ctes) {
          this.#ctes.add(cte);
        }
        const tables = this.#collectSchemableIds(node);
        for (const table of tables) {
          this.#schemableIds.add(table);
        }
        const transformed = super.transformNodeImpl(node);
        for (const table of tables) {
          this.#schemableIds.delete(table);
        }
        for (const cte of ctes) {
          this.#ctes.delete(cte);
        }
        return transformed;
      }
      transformSchemableIdentifier(node) {
        const transformed = super.transformSchemableIdentifier(node);
        if (transformed.schema || !this.#schemableIds.has(node.identifier.name)) {
          return transformed;
        }
        return {
          ...transformed,
          schema: IdentifierNode.create(this.#schema)
        };
      }
      transformReferences(node) {
        const transformed = super.transformReferences(node);
        if (transformed.table.table.schema) {
          return transformed;
        }
        return {
          ...transformed,
          table: TableNode.createWithSchema(this.#schema, transformed.table.table.identifier.name)
        };
      }
      #isRootOperationNode(node) {
        return node.kind in ROOT_OPERATION_NODES;
      }
      #collectSchemableIds(node) {
        const schemableIds = /* @__PURE__ */ new Set();
        if ("name" in node && node.name && SchemableIdentifierNode.is(node.name)) {
          this.#collectSchemableId(node.name, schemableIds);
        }
        if ("from" in node && node.from) {
          for (const from of node.from.froms) {
            this.#collectSchemableIdsFromTableExpr(from, schemableIds);
          }
        }
        if ("into" in node && node.into) {
          this.#collectSchemableIdsFromTableExpr(node.into, schemableIds);
        }
        if ("table" in node && node.table) {
          this.#collectSchemableIdsFromTableExpr(node.table, schemableIds);
        }
        if ("joins" in node && node.joins) {
          for (const join of node.joins) {
            this.#collectSchemableIdsFromTableExpr(join.table, schemableIds);
          }
        }
        return schemableIds;
      }
      #collectCTEs(node) {
        const ctes = /* @__PURE__ */ new Set();
        if ("with" in node && node.with) {
          this.#collectCTEIds(node.with, ctes);
        }
        return ctes;
      }
      #collectSchemableIdsFromTableExpr(node, schemableIds) {
        const table = TableNode.is(node) ? node : AliasNode.is(node) && TableNode.is(node.node) ? node.node : null;
        if (table) {
          this.#collectSchemableId(table.table, schemableIds);
        }
      }
      #collectSchemableId(node, schemableIds) {
        const id = node.identifier.name;
        if (!this.#schemableIds.has(id) && !this.#ctes.has(id)) {
          schemableIds.add(id);
        }
      }
      #collectCTEIds(node, ctes) {
        for (const expr of node.expressions) {
          const cteId = expr.name.table.table.identifier.name;
          if (!this.#ctes.has(cteId)) {
            ctes.add(cteId);
          }
        }
      }
    };
  }
});

// node_modules/kysely/dist/esm/plugin/with-schema/with-schema-plugin.js
var WithSchemaPlugin;
var init_with_schema_plugin = __esm({
  "node_modules/kysely/dist/esm/plugin/with-schema/with-schema-plugin.js"() {
    init_with_schema_transformer();
    WithSchemaPlugin = class {
      #transformer;
      constructor(schema9) {
        this.#transformer = new WithSchemaTransformer(schema9);
      }
      transformQuery(args) {
        return this.#transformer.transformNode(args.node);
      }
      async transformResult(args) {
        return args.result;
      }
    };
  }
});

// node_modules/kysely/dist/esm/query-creator.js
var QueryCreator;
var init_query_creator = __esm({
  "node_modules/kysely/dist/esm/query-creator.js"() {
    init_select_query_builder();
    init_insert_query_builder();
    init_delete_query_builder();
    init_update_query_builder();
    init_delete_query_node();
    init_insert_query_node();
    init_select_query_node();
    init_update_query_node();
    init_table_parser();
    init_with_parser();
    init_with_node();
    init_query_id();
    init_with_schema_plugin();
    init_object_utils();
    init_select_parser();
    QueryCreator = class _QueryCreator {
      #props;
      constructor(props) {
        this.#props = freeze(props);
      }
      selectFrom(from) {
        return createSelectQueryBuilder({
          queryId: createQueryId(),
          executor: this.#props.executor,
          queryNode: SelectQueryNode.createFrom(parseTableExpressionOrList(from), this.#props.withNode)
        });
      }
      selectNoFrom(selection) {
        return createSelectQueryBuilder({
          queryId: createQueryId(),
          executor: this.#props.executor,
          queryNode: SelectQueryNode.cloneWithSelections(SelectQueryNode.create(this.#props.withNode), parseSelectArg(selection))
        });
      }
      /**
       * Creates an insert query.
       *
       * The return value of this query is an instance of {@link InsertResult}. {@link InsertResult}
       * has the {@link InsertResult.insertId | insertId} field that holds the auto incremented id of
       * the inserted row if the db returned one.
       *
       * See the {@link InsertQueryBuilder.values | values} method for more info and examples. Also see
       * the {@link ReturningInterface.returning | returning} method for a way to return columns
       * on supported databases like PostgreSQL.
       *
       * ### Examples
       *
       * ```ts
       * const result = await db
       *   .insertInto('person')
       *   .values({
       *     first_name: 'Jennifer',
       *     last_name: 'Aniston'
       *   })
       *   .executeTakeFirst()
       *
       * console.log(result.insertId)
       * ```
       *
       * Some databases like PostgreSQL support the `returning` method:
       *
       * ```ts
       * const { id } = await db
       *   .insertInto('person')
       *   .values({
       *     first_name: 'Jennifer',
       *     last_name: 'Aniston'
       *   })
       *   .returning('id')
       *   .executeTakeFirst()
       * ```
       */
      insertInto(table) {
        return new InsertQueryBuilder({
          queryId: createQueryId(),
          executor: this.#props.executor,
          queryNode: InsertQueryNode.create(parseTable(table), this.#props.withNode)
        });
      }
      /**
       * Creates a replace query.
       *
       * A MySQL-only statement similar to {@link InsertQueryBuilder.onDuplicateKeyUpdate}
       * that deletes and inserts values on collision instead of updating existing rows.
       *
       * The return value of this query is an instance of {@link InsertResult}. {@link InsertResult}
       * has the {@link InsertResult.insertId | insertId} field that holds the auto incremented id of
       * the inserted row if the db returned one.
       *
       * See the {@link InsertQueryBuilder.values | values} method for more info and examples.
       *
       * ### Examples
       *
       * ```ts
       * const result = await db
       *   .replaceInto('person')
       *   .values({
       *     first_name: 'Jennifer',
       *     last_name: 'Aniston'
       *   })
       *   .executeTakeFirst()
       *
       * console.log(result.insertId)
       * ```
       */
      replaceInto(table) {
        return new InsertQueryBuilder({
          queryId: createQueryId(),
          executor: this.#props.executor,
          queryNode: InsertQueryNode.create(parseTable(table), this.#props.withNode, true)
        });
      }
      deleteFrom(tables) {
        return new DeleteQueryBuilder({
          queryId: createQueryId(),
          executor: this.#props.executor,
          queryNode: DeleteQueryNode.create(parseTableExpressionOrList(tables), this.#props.withNode)
        });
      }
      updateTable(table) {
        return new UpdateQueryBuilder({
          queryId: createQueryId(),
          executor: this.#props.executor,
          queryNode: UpdateQueryNode.create(parseTableExpression(table), this.#props.withNode)
        });
      }
      /**
       * Creates a `with` query (Common Table Expression).
       *
       * ### Examples
       *
       * ```ts
       * await db
       *   .with('jennifers', (db) => db
       *     .selectFrom('person')
       *     .where('first_name', '=', 'Jennifer')
       *     .select(['id', 'age'])
       *   )
       *   .with('adult_jennifers', (db) => db
       *     .selectFrom('jennifers')
       *     .where('age', '>', 18)
       *     .select(['id', 'age'])
       *   )
       *   .selectFrom('adult_jennifers')
       *   .where('age', '<', 60)
       *   .selectAll()
       *   .execute()
       * ```
       *
       * The CTE name can optionally specify column names in addition to
       * a name. In that case Kysely requires the expression to retun
       * rows with the same columns.
       *
       * ```ts
       * await db
       *   .with('jennifers(id, age)', (db) => db
       *     .selectFrom('person')
       *     .where('first_name', '=', 'Jennifer')
       *     // This is ok since we return columns with the same
       *     // names as specified by `jennifers(id, age)`.
       *     .select(['id', 'age'])
       *   )
       *   .selectFrom('jennifers')
       *   .selectAll()
       *   .execute()
       * ```
       *
       * The first argument can also be a callback. The callback is passed
       * a `CTEBuilder` instance that can be used to configure the CTE:
       *
       * ```ts
       * await db
       *   .with(
       *     (cte) => cte('jennifers').materialized(),
       *     (db) => db
       *       .selectFrom('person')
       *       .where('first_name', '=', 'Jennifer')
       *       .select(['id', 'age'])
       *   )
       *   .selectFrom('jennifers')
       *   .selectAll()
       *   .execute()
       * ```
       */
      with(nameOrBuilder, expression) {
        const cte = parseCommonTableExpression(nameOrBuilder, expression);
        return new _QueryCreator({
          ...this.#props,
          withNode: this.#props.withNode ? WithNode.cloneWithExpression(this.#props.withNode, cte) : WithNode.create(cte)
        });
      }
      /**
       * Creates a recursive `with` query (Common Table Expression).
       *
       * Note that recursiveness is a property of the whole `with` statement.
       * You cannot have recursive and non-recursive CTEs in a same `with` statement.
       * Therefore the recursiveness is determined by the **first** `with` or
       * `withRecusive` call you make.
       *
       * See the {@link with} method for examples and more documentation.
       */
      withRecursive(nameOrBuilder, expression) {
        const cte = parseCommonTableExpression(nameOrBuilder, expression);
        return new _QueryCreator({
          ...this.#props,
          withNode: this.#props.withNode ? WithNode.cloneWithExpression(this.#props.withNode, cte) : WithNode.create(cte, { recursive: true })
        });
      }
      /**
       * Returns a copy of this query creator instance with the given plugin installed.
       */
      withPlugin(plugin) {
        return new _QueryCreator({
          ...this.#props,
          executor: this.#props.executor.withPlugin(plugin)
        });
      }
      /**
       * Returns a copy of this query creator instance without any plugins.
       */
      withoutPlugins() {
        return new _QueryCreator({
          ...this.#props,
          executor: this.#props.executor.withoutPlugins()
        });
      }
      /**
       * Sets the schema to be used for all table references that don't explicitly
       * specify a schema.
       *
       * This only affects the query created through the builder returned from
       * this method and doesn't modify the `db` instance.
       *
       * See [this recipe](https://github.com/koskimas/kysely/tree/master/site/docs/recipes/schemas.md)
       * for a more detailed explanation.
       *
       * ### Examples
       *
       * ```
       * await db
       *   .withSchema('mammals')
       *   .selectFrom('pet')
       *   .selectAll()
       *   .innerJoin('public.person', 'public.person.id', 'pet.owner_id')
       *   .execute()
       * ```
       *
       * The generated SQL (PostgreSQL):
       *
       * ```sql
       * select * from "mammals"."pet"
       * inner join "public"."person"
       * on "public"."person"."id" = "mammals"."pet"."owner_id"
       * ```
       *
       * `withSchema` is smart enough to not add schema for aliases,
       * common table expressions or other places where the schema
       * doesn't belong to:
       *
       * ```
       * await db
       *   .withSchema('mammals')
       *   .selectFrom('pet as p')
       *   .select('p.name')
       *   .execute()
       * ```
       *
       * The generated SQL (PostgreSQL):
       *
       * ```sql
       * select "p"."name" from "mammals"."pet" as "p"
       * ```
       */
      withSchema(schema9) {
        return new _QueryCreator({
          ...this.#props,
          executor: this.#props.executor.withPluginAtFront(new WithSchemaPlugin(schema9))
        });
      }
    };
  }
});

// node_modules/kysely/dist/esm/util/deferred.js
var Deferred;
var init_deferred = __esm({
  "node_modules/kysely/dist/esm/util/deferred.js"() {
    Deferred = class {
      #promise;
      #resolve;
      #reject;
      constructor() {
        this.#promise = new Promise((resolve, reject) => {
          this.#reject = reject;
          this.#resolve = resolve;
        });
      }
      get promise() {
        return this.#promise;
      }
      resolve = (value) => {
        if (this.#resolve) {
          this.#resolve(value);
        }
      };
      reject = (reason) => {
        if (this.#reject) {
          this.#reject(reason);
        }
      };
    };
  }
});

// node_modules/kysely/dist/esm/util/log-once.js
function logOnce(message2) {
  if (LOGGED_MESSAGES.has(message2)) {
    return;
  }
  LOGGED_MESSAGES.add(message2);
  console.log(message2);
}
var LOGGED_MESSAGES;
var init_log_once = __esm({
  "node_modules/kysely/dist/esm/util/log-once.js"() {
    LOGGED_MESSAGES = /* @__PURE__ */ new Set();
  }
});

// node_modules/kysely/dist/esm/query-executor/query-executor-base.js
function warnOfOutdatedDriverOrPlugins(result, transformedResult) {
  const { numAffectedRows } = result;
  if (numAffectedRows === void 0 && result.numUpdatedOrDeletedRows === void 0 || numAffectedRows !== void 0 && transformedResult.numAffectedRows !== void 0) {
    return;
  }
  logOnce("kysely:warning: outdated driver/plugin detected! QueryResult.numUpdatedOrDeletedRows is deprecated and will be removed in a future release.");
}
var NO_PLUGINS, QueryExecutorBase;
var init_query_executor_base = __esm({
  "node_modules/kysely/dist/esm/query-executor/query-executor-base.js"() {
    init_object_utils();
    init_deferred();
    init_log_once();
    NO_PLUGINS = freeze([]);
    QueryExecutorBase = class {
      #plugins;
      constructor(plugins = NO_PLUGINS) {
        this.#plugins = plugins;
      }
      get plugins() {
        return this.#plugins;
      }
      transformQuery(node, queryId) {
        for (const plugin of this.#plugins) {
          const transformedNode = plugin.transformQuery({ node, queryId });
          if (transformedNode.kind === node.kind) {
            node = transformedNode;
          } else {
            throw new Error([
              `KyselyPlugin.transformQuery must return a node`,
              `of the same kind that was given to it.`,
              `The plugin was given a ${node.kind}`,
              `but it returned a ${transformedNode.kind}`
            ].join(" "));
          }
        }
        return node;
      }
      async executeQuery(compiledQuery, queryId) {
        return await this.provideConnection(async (connection) => {
          const result = await connection.executeQuery(compiledQuery);
          const transformedResult = await this.#transformResult(result, queryId);
          warnOfOutdatedDriverOrPlugins(result, transformedResult);
          return transformedResult;
        });
      }
      async *stream(compiledQuery, chunkSize, queryId) {
        const connectionDefer = new Deferred();
        const connectionReleaseDefer = new Deferred();
        this.provideConnection(async (connection2) => {
          connectionDefer.resolve(connection2);
          return await connectionReleaseDefer.promise;
        }).catch((ex) => connectionDefer.reject(ex));
        const connection = await connectionDefer.promise;
        try {
          for await (const result of connection.streamQuery(compiledQuery, chunkSize)) {
            yield await this.#transformResult(result, queryId);
          }
        } finally {
          connectionReleaseDefer.resolve();
        }
      }
      async #transformResult(result, queryId) {
        for (const plugin of this.#plugins) {
          result = await plugin.transformResult({ result, queryId });
        }
        return result;
      }
    };
  }
});

// node_modules/kysely/dist/esm/query-executor/noop-query-executor.js
var NoopQueryExecutor, NOOP_QUERY_EXECUTOR;
var init_noop_query_executor = __esm({
  "node_modules/kysely/dist/esm/query-executor/noop-query-executor.js"() {
    init_query_executor_base();
    NoopQueryExecutor = class _NoopQueryExecutor extends QueryExecutorBase {
      get adapter() {
        throw new Error("this query cannot be compiled to SQL");
      }
      compileQuery() {
        throw new Error("this query cannot be compiled to SQL");
      }
      provideConnection() {
        throw new Error("this query cannot be executed");
      }
      withConnectionProvider() {
        throw new Error("this query cannot have a connection provider");
      }
      withPlugin(plugin) {
        return new _NoopQueryExecutor([...this.plugins, plugin]);
      }
      withPlugins(plugins) {
        return new _NoopQueryExecutor([...this.plugins, ...plugins]);
      }
      withPluginAtFront(plugin) {
        return new _NoopQueryExecutor([plugin, ...this.plugins]);
      }
      withoutPlugins() {
        return new _NoopQueryExecutor([]);
      }
    };
    NOOP_QUERY_EXECUTOR = new NoopQueryExecutor();
  }
});

// node_modules/kysely/dist/esm/parser/parse-utils.js
function createQueryCreator() {
  return new QueryCreator({
    executor: NOOP_QUERY_EXECUTOR
  });
}
function createJoinBuilder(joinType, table) {
  return new JoinBuilder({
    joinNode: JoinNode.create(joinType, parseTableExpression(table))
  });
}
function createOverBuilder() {
  return new OverBuilder({
    overNode: OverNode.create()
  });
}
var init_parse_utils = __esm({
  "node_modules/kysely/dist/esm/parser/parse-utils.js"() {
    init_join_node();
    init_over_node();
    init_join_builder();
    init_over_builder();
    init_query_creator();
    init_noop_query_executor();
    init_table_parser();
  }
});

// node_modules/kysely/dist/esm/parser/join-parser.js
function parseJoin(joinType, args) {
  if (args.length === 3) {
    return parseSingleOnJoin(joinType, args[0], args[1], args[2]);
  } else if (args.length === 2) {
    return parseCallbackJoin(joinType, args[0], args[1]);
  } else {
    throw new Error("not implemented");
  }
}
function parseCallbackJoin(joinType, from, callback) {
  return callback(createJoinBuilder(joinType, from)).toOperationNode();
}
function parseSingleOnJoin(joinType, from, lhsColumn, rhsColumn) {
  return JoinNode.createWithOn(joinType, parseTableExpression(from), parseReferentialBinaryOperation(lhsColumn, "=", rhsColumn));
}
var init_join_parser = __esm({
  "node_modules/kysely/dist/esm/parser/join-parser.js"() {
    init_join_node();
    init_table_parser();
    init_binary_operation_parser();
    init_parse_utils();
  }
});

// node_modules/kysely/dist/esm/operation-node/offset-node.js
var OffsetNode;
var init_offset_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/offset-node.js"() {
    init_object_utils();
    init_value_node();
    OffsetNode = freeze({
      is(node) {
        return node.kind === "OffsetNode";
      },
      create(offset) {
        return freeze({
          kind: "OffsetNode",
          offset: ValueNode.create(offset)
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/group-by-item-node.js
var GroupByItemNode;
var init_group_by_item_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/group-by-item-node.js"() {
    init_object_utils();
    GroupByItemNode = freeze({
      is(node) {
        return node.kind === "GroupByItemNode";
      },
      create(groupBy) {
        return freeze({
          kind: "GroupByItemNode",
          groupBy
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/parser/group-by-parser.js
function parseGroupBy(groupBy) {
  groupBy = isFunction(groupBy) ? groupBy(expressionBuilder()) : groupBy;
  return parseReferenceExpressionOrList(groupBy).map(GroupByItemNode.create);
}
var init_group_by_parser = __esm({
  "node_modules/kysely/dist/esm/parser/group-by-parser.js"() {
    init_group_by_item_node();
    init_expression_builder();
    init_object_utils();
    init_reference_parser();
  }
});

// node_modules/kysely/dist/esm/operation-node/set-operation-node.js
var SetOperationNode;
var init_set_operation_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/set-operation-node.js"() {
    init_object_utils();
    SetOperationNode = freeze({
      is(node) {
        return node.kind === "SetOperationNode";
      },
      create(operator, expression, all) {
        return freeze({
          kind: "SetOperationNode",
          operator,
          expression,
          all
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/parser/set-operation-parser.js
function parseSetOperations(operator, expression, all) {
  if (isFunction(expression)) {
    expression = expression(createExpressionBuilder());
  }
  if (!isReadonlyArray(expression)) {
    expression = [expression];
  }
  return expression.map((expr) => SetOperationNode.create(operator, parseExpression(expr), all));
}
var init_set_operation_parser = __esm({
  "node_modules/kysely/dist/esm/parser/set-operation-parser.js"() {
    init_expression_builder();
    init_set_operation_node();
    init_object_utils();
    init_expression_parser();
  }
});

// node_modules/kysely/dist/esm/expression/expression-wrapper.js
var ExpressionWrapper, AliasedExpressionWrapper, OrWrapper, AndWrapper;
var init_expression_wrapper = __esm({
  "node_modules/kysely/dist/esm/expression/expression-wrapper.js"() {
    init_alias_node();
    init_and_node();
    init_identifier_node();
    init_operation_node_source();
    init_or_node();
    init_parens_node();
    init_binary_operation_parser();
    ExpressionWrapper = class _ExpressionWrapper {
      #node;
      constructor(node) {
        this.#node = node;
      }
      /** @private */
      get expressionType() {
        return void 0;
      }
      as(alias) {
        return new AliasedExpressionWrapper(this, alias);
      }
      or(...args) {
        return new OrWrapper(OrNode.create(this.#node, parseValueBinaryOperationOrExpression(args)));
      }
      and(...args) {
        return new AndWrapper(AndNode.create(this.#node, parseValueBinaryOperationOrExpression(args)));
      }
      /**
       * Change the output type of the expression.
       *
       * This method call doesn't change the SQL in any way. This methods simply
       * returns a copy of this `ExpressionWrapper` with a new output type.
       */
      $castTo() {
        return new _ExpressionWrapper(this.#node);
      }
      toOperationNode() {
        return this.#node;
      }
    };
    AliasedExpressionWrapper = class {
      #expr;
      #alias;
      constructor(expr, alias) {
        this.#expr = expr;
        this.#alias = alias;
      }
      /** @private */
      get expression() {
        return this.#expr;
      }
      /** @private */
      get alias() {
        return this.#alias;
      }
      toOperationNode() {
        return AliasNode.create(this.#expr.toOperationNode(), isOperationNodeSource(this.#alias) ? this.#alias.toOperationNode() : IdentifierNode.create(this.#alias));
      }
    };
    OrWrapper = class _OrWrapper {
      #node;
      constructor(node) {
        this.#node = node;
      }
      /** @private */
      get expressionType() {
        return void 0;
      }
      as(alias) {
        return new AliasedExpressionWrapper(this, alias);
      }
      or(...args) {
        return new _OrWrapper(OrNode.create(this.#node, parseValueBinaryOperationOrExpression(args)));
      }
      /**
       * Change the output type of the expression.
       *
       * This method call doesn't change the SQL in any way. This methods simply
       * returns a copy of this `OrWrapper` with a new output type.
       */
      $castTo() {
        return new _OrWrapper(this.#node);
      }
      toOperationNode() {
        return ParensNode.create(this.#node);
      }
    };
    AndWrapper = class _AndWrapper {
      #node;
      constructor(node) {
        this.#node = node;
      }
      /** @private */
      get expressionType() {
        return void 0;
      }
      as(alias) {
        return new AliasedExpressionWrapper(this, alias);
      }
      and(...args) {
        return new _AndWrapper(AndNode.create(this.#node, parseValueBinaryOperationOrExpression(args)));
      }
      /**
       * Change the output type of the expression.
       *
       * This method call doesn't change the SQL in any way. This methods simply
       * returns a copy of this `AndWrapper` with a new output type.
       */
      $castTo() {
        return new _AndWrapper(this.#node);
      }
      toOperationNode() {
        return ParensNode.create(this.#node);
      }
    };
  }
});

// node_modules/kysely/dist/esm/query-builder/select-query-builder.js
function createSelectQueryBuilder(props) {
  return new SelectQueryBuilderImpl(props);
}
var SelectQueryBuilderImpl, AliasedSelectQueryBuilderImpl;
var init_select_query_builder = __esm({
  "node_modules/kysely/dist/esm/query-builder/select-query-builder.js"() {
    init_alias_node();
    init_select_modifier_node();
    init_join_parser();
    init_select_parser();
    init_reference_parser();
    init_select_query_node();
    init_query_node();
    init_order_by_parser();
    init_prevent_await();
    init_limit_node();
    init_offset_node();
    init_object_utils();
    init_group_by_parser();
    init_no_result_error();
    init_identifier_node();
    init_set_operation_parser();
    init_binary_operation_parser();
    init_expression_wrapper();
    SelectQueryBuilderImpl = class _SelectQueryBuilderImpl {
      #props;
      constructor(props) {
        this.#props = freeze(props);
      }
      get expressionType() {
        return void 0;
      }
      get isSelectQueryBuilder() {
        return true;
      }
      where(...args) {
        return new _SelectQueryBuilderImpl({
          ...this.#props,
          queryNode: QueryNode.cloneWithWhere(this.#props.queryNode, parseValueBinaryOperationOrExpression(args))
        });
      }
      whereRef(lhs, op, rhs) {
        return new _SelectQueryBuilderImpl({
          ...this.#props,
          queryNode: QueryNode.cloneWithWhere(this.#props.queryNode, parseReferentialBinaryOperation(lhs, op, rhs))
        });
      }
      having(...args) {
        return new _SelectQueryBuilderImpl({
          ...this.#props,
          queryNode: SelectQueryNode.cloneWithHaving(this.#props.queryNode, parseValueBinaryOperationOrExpression(args))
        });
      }
      havingRef(lhs, op, rhs) {
        return new _SelectQueryBuilderImpl({
          ...this.#props,
          queryNode: SelectQueryNode.cloneWithHaving(this.#props.queryNode, parseReferentialBinaryOperation(lhs, op, rhs))
        });
      }
      select(selection) {
        return new _SelectQueryBuilderImpl({
          ...this.#props,
          queryNode: SelectQueryNode.cloneWithSelections(this.#props.queryNode, parseSelectArg(selection))
        });
      }
      distinctOn(selection) {
        return new _SelectQueryBuilderImpl({
          ...this.#props,
          queryNode: SelectQueryNode.cloneWithDistinctOn(this.#props.queryNode, parseReferenceExpressionOrList(selection))
        });
      }
      modifyFront(modifier) {
        return new _SelectQueryBuilderImpl({
          ...this.#props,
          queryNode: SelectQueryNode.cloneWithFrontModifier(this.#props.queryNode, SelectModifierNode.createWithExpression(modifier.toOperationNode()))
        });
      }
      modifyEnd(modifier) {
        return new _SelectQueryBuilderImpl({
          ...this.#props,
          queryNode: SelectQueryNode.cloneWithEndModifier(this.#props.queryNode, SelectModifierNode.createWithExpression(modifier.toOperationNode()))
        });
      }
      distinct() {
        return new _SelectQueryBuilderImpl({
          ...this.#props,
          queryNode: SelectQueryNode.cloneWithFrontModifier(this.#props.queryNode, SelectModifierNode.create("Distinct"))
        });
      }
      forUpdate() {
        return new _SelectQueryBuilderImpl({
          ...this.#props,
          queryNode: SelectQueryNode.cloneWithEndModifier(this.#props.queryNode, SelectModifierNode.create("ForUpdate"))
        });
      }
      forShare() {
        return new _SelectQueryBuilderImpl({
          ...this.#props,
          queryNode: SelectQueryNode.cloneWithEndModifier(this.#props.queryNode, SelectModifierNode.create("ForShare"))
        });
      }
      forKeyShare() {
        return new _SelectQueryBuilderImpl({
          ...this.#props,
          queryNode: SelectQueryNode.cloneWithEndModifier(this.#props.queryNode, SelectModifierNode.create("ForKeyShare"))
        });
      }
      forNoKeyUpdate() {
        return new _SelectQueryBuilderImpl({
          ...this.#props,
          queryNode: SelectQueryNode.cloneWithEndModifier(this.#props.queryNode, SelectModifierNode.create("ForNoKeyUpdate"))
        });
      }
      skipLocked() {
        return new _SelectQueryBuilderImpl({
          ...this.#props,
          queryNode: SelectQueryNode.cloneWithEndModifier(this.#props.queryNode, SelectModifierNode.create("SkipLocked"))
        });
      }
      noWait() {
        return new _SelectQueryBuilderImpl({
          ...this.#props,
          queryNode: SelectQueryNode.cloneWithEndModifier(this.#props.queryNode, SelectModifierNode.create("NoWait"))
        });
      }
      selectAll(table) {
        return new _SelectQueryBuilderImpl({
          ...this.#props,
          queryNode: SelectQueryNode.cloneWithSelections(this.#props.queryNode, parseSelectAll(table))
        });
      }
      innerJoin(...args) {
        return new _SelectQueryBuilderImpl({
          ...this.#props,
          queryNode: QueryNode.cloneWithJoin(this.#props.queryNode, parseJoin("InnerJoin", args))
        });
      }
      leftJoin(...args) {
        return new _SelectQueryBuilderImpl({
          ...this.#props,
          queryNode: QueryNode.cloneWithJoin(this.#props.queryNode, parseJoin("LeftJoin", args))
        });
      }
      rightJoin(...args) {
        return new _SelectQueryBuilderImpl({
          ...this.#props,
          queryNode: QueryNode.cloneWithJoin(this.#props.queryNode, parseJoin("RightJoin", args))
        });
      }
      fullJoin(...args) {
        return new _SelectQueryBuilderImpl({
          ...this.#props,
          queryNode: QueryNode.cloneWithJoin(this.#props.queryNode, parseJoin("FullJoin", args))
        });
      }
      innerJoinLateral(...args) {
        return new _SelectQueryBuilderImpl({
          ...this.#props,
          queryNode: QueryNode.cloneWithJoin(this.#props.queryNode, parseJoin("LateralInnerJoin", args))
        });
      }
      leftJoinLateral(...args) {
        return new _SelectQueryBuilderImpl({
          ...this.#props,
          queryNode: QueryNode.cloneWithJoin(this.#props.queryNode, parseJoin("LateralLeftJoin", args))
        });
      }
      orderBy(...args) {
        return new _SelectQueryBuilderImpl({
          ...this.#props,
          queryNode: SelectQueryNode.cloneWithOrderByItems(this.#props.queryNode, parseOrderBy(args))
        });
      }
      groupBy(groupBy) {
        return new _SelectQueryBuilderImpl({
          ...this.#props,
          queryNode: SelectQueryNode.cloneWithGroupByItems(this.#props.queryNode, parseGroupBy(groupBy))
        });
      }
      limit(limit) {
        return new _SelectQueryBuilderImpl({
          ...this.#props,
          queryNode: SelectQueryNode.cloneWithLimit(this.#props.queryNode, LimitNode.create(limit))
        });
      }
      offset(offset) {
        return new _SelectQueryBuilderImpl({
          ...this.#props,
          queryNode: SelectQueryNode.cloneWithOffset(this.#props.queryNode, OffsetNode.create(offset))
        });
      }
      union(expression) {
        return new _SelectQueryBuilderImpl({
          ...this.#props,
          queryNode: SelectQueryNode.cloneWithSetOperations(this.#props.queryNode, parseSetOperations("union", expression, false))
        });
      }
      unionAll(expression) {
        return new _SelectQueryBuilderImpl({
          ...this.#props,
          queryNode: SelectQueryNode.cloneWithSetOperations(this.#props.queryNode, parseSetOperations("union", expression, true))
        });
      }
      intersect(expression) {
        return new _SelectQueryBuilderImpl({
          ...this.#props,
          queryNode: SelectQueryNode.cloneWithSetOperations(this.#props.queryNode, parseSetOperations("intersect", expression, false))
        });
      }
      intersectAll(expression) {
        return new _SelectQueryBuilderImpl({
          ...this.#props,
          queryNode: SelectQueryNode.cloneWithSetOperations(this.#props.queryNode, parseSetOperations("intersect", expression, true))
        });
      }
      except(expression) {
        return new _SelectQueryBuilderImpl({
          ...this.#props,
          queryNode: SelectQueryNode.cloneWithSetOperations(this.#props.queryNode, parseSetOperations("except", expression, false))
        });
      }
      exceptAll(expression) {
        return new _SelectQueryBuilderImpl({
          ...this.#props,
          queryNode: SelectQueryNode.cloneWithSetOperations(this.#props.queryNode, parseSetOperations("except", expression, true))
        });
      }
      as(alias) {
        return new AliasedSelectQueryBuilderImpl(this, alias);
      }
      clearSelect() {
        return new _SelectQueryBuilderImpl({
          ...this.#props,
          queryNode: SelectQueryNode.cloneWithoutSelections(this.#props.queryNode)
        });
      }
      clearWhere() {
        return new _SelectQueryBuilderImpl({
          ...this.#props,
          queryNode: QueryNode.cloneWithoutWhere(this.#props.queryNode)
        });
      }
      clearLimit() {
        return new _SelectQueryBuilderImpl({
          ...this.#props,
          queryNode: SelectQueryNode.cloneWithoutLimit(this.#props.queryNode)
        });
      }
      clearOffset() {
        return new _SelectQueryBuilderImpl({
          ...this.#props,
          queryNode: SelectQueryNode.cloneWithoutOffset(this.#props.queryNode)
        });
      }
      clearOrderBy() {
        return new _SelectQueryBuilderImpl({
          ...this.#props,
          queryNode: SelectQueryNode.cloneWithoutOrderBy(this.#props.queryNode)
        });
      }
      $call(func) {
        return func(this);
      }
      $if(condition, func) {
        if (condition) {
          return func(this);
        }
        return new _SelectQueryBuilderImpl({
          ...this.#props
        });
      }
      $castTo() {
        return new _SelectQueryBuilderImpl(this.#props);
      }
      $narrowType() {
        return new _SelectQueryBuilderImpl(this.#props);
      }
      $assertType() {
        return new _SelectQueryBuilderImpl(this.#props);
      }
      $asTuple() {
        return new ExpressionWrapper(this.toOperationNode());
      }
      withPlugin(plugin) {
        return new _SelectQueryBuilderImpl({
          ...this.#props,
          executor: this.#props.executor.withPlugin(plugin)
        });
      }
      toOperationNode() {
        return this.#props.executor.transformQuery(this.#props.queryNode, this.#props.queryId);
      }
      compile() {
        return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
      }
      async execute() {
        const compiledQuery = this.compile();
        const result = await this.#props.executor.executeQuery(compiledQuery, this.#props.queryId);
        return result.rows;
      }
      async executeTakeFirst() {
        const [result] = await this.execute();
        return result;
      }
      async executeTakeFirstOrThrow(errorConstructor = NoResultError) {
        const result = await this.executeTakeFirst();
        if (result === void 0) {
          const error = isNoResultErrorConstructor(errorConstructor) ? new errorConstructor(this.toOperationNode()) : errorConstructor(this.toOperationNode());
          throw error;
        }
        return result;
      }
      async *stream(chunkSize = 100) {
        const compiledQuery = this.compile();
        const stream = this.#props.executor.stream(compiledQuery, chunkSize, this.#props.queryId);
        for await (const item of stream) {
          yield* item.rows;
        }
      }
      async explain(format, options) {
        const builder = new _SelectQueryBuilderImpl({
          ...this.#props,
          queryNode: QueryNode.cloneWithExplain(this.#props.queryNode, format, options)
        });
        return await builder.execute();
      }
    };
    preventAwait(SelectQueryBuilderImpl, "don't await SelectQueryBuilder instances directly. To execute the query you need to call `execute` or `executeTakeFirst`.");
    AliasedSelectQueryBuilderImpl = class {
      #queryBuilder;
      #alias;
      constructor(queryBuilder, alias) {
        this.#queryBuilder = queryBuilder;
        this.#alias = alias;
      }
      get expression() {
        return this.#queryBuilder;
      }
      get alias() {
        return this.#alias;
      }
      get isAliasedSelectQueryBuilder() {
        return true;
      }
      toOperationNode() {
        return AliasNode.create(this.#queryBuilder.toOperationNode(), IdentifierNode.create(this.#alias));
      }
    };
    preventAwait(AliasedSelectQueryBuilderImpl, "don't await AliasedSelectQueryBuilder instances directly. AliasedSelectQueryBuilder should never be executed directly since it's always a part of another query.");
  }
});

// node_modules/kysely/dist/esm/operation-node/aggregate-function-node.js
var AggregateFunctionNode;
var init_aggregate_function_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/aggregate-function-node.js"() {
    init_object_utils();
    init_where_node();
    AggregateFunctionNode = freeze({
      is(node) {
        return node.kind === "AggregateFunctionNode";
      },
      create(aggregateFunction, aggregated = []) {
        return freeze({
          kind: "AggregateFunctionNode",
          func: aggregateFunction,
          aggregated
        });
      },
      cloneWithDistinct(aggregateFunctionNode) {
        return freeze({
          ...aggregateFunctionNode,
          distinct: true
        });
      },
      cloneWithFilter(aggregateFunctionNode, filter) {
        return freeze({
          ...aggregateFunctionNode,
          filter: aggregateFunctionNode.filter ? WhereNode.cloneWithOperation(aggregateFunctionNode.filter, "And", filter) : WhereNode.create(filter)
        });
      },
      cloneWithOrFilter(aggregateFunctionNode, filter) {
        return freeze({
          ...aggregateFunctionNode,
          filter: aggregateFunctionNode.filter ? WhereNode.cloneWithOperation(aggregateFunctionNode.filter, "Or", filter) : WhereNode.create(filter)
        });
      },
      cloneWithOver(aggregateFunctionNode, over) {
        return freeze({
          ...aggregateFunctionNode,
          over
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/function-node.js
var FunctionNode;
var init_function_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/function-node.js"() {
    init_object_utils();
    FunctionNode = freeze({
      is(node) {
        return node.kind === "FunctionNode";
      },
      create(func, args) {
        return freeze({
          kind: "FunctionNode",
          func,
          arguments: args
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/query-builder/aggregate-function-builder.js
var AggregateFunctionBuilder, AliasedAggregateFunctionBuilder;
var init_aggregate_function_builder = __esm({
  "node_modules/kysely/dist/esm/query-builder/aggregate-function-builder.js"() {
    init_object_utils();
    init_aggregate_function_node();
    init_alias_node();
    init_identifier_node();
    init_prevent_await();
    init_parse_utils();
    init_binary_operation_parser();
    AggregateFunctionBuilder = class _AggregateFunctionBuilder {
      #props;
      constructor(props) {
        this.#props = freeze(props);
      }
      /** @private */
      get expressionType() {
        return void 0;
      }
      /**
       * Returns an aliased version of the function.
       *
       * In addition to slapping `as "the_alias"` to the end of the SQL,
       * this method also provides strict typing:
       *
       * ```ts
       * const result = await db
       *   .selectFrom('person')
       *   .select(
       *     (eb) => eb.fn.count<number>('id').as('person_count')
       *   )
       *   .executeTakeFirstOrThrow()
       *
       * // `person_count: number` field exists in the result type.
       * console.log(result.person_count)
       * ```
       *
       * The generated SQL (PostgreSQL):
       *
       * ```sql
       * select count("id") as "person_count"
       * from "person"
       * ```
       */
      as(alias) {
        return new AliasedAggregateFunctionBuilder(this, alias);
      }
      /**
       * Adds a `distinct` clause inside the function.
       *
       * ### Examples
       *
       * ```ts
       * const result = await db
       *   .selectFrom('person')
       *   .select((eb) =>
       *     eb.fn.count<number>('first_name').distinct().as('first_name_count')
       *   )
       *   .executeTakeFirstOrThrow()
       * ```
       *
       * The generated SQL (PostgreSQL):
       *
       * ```sql
       * select count(distinct "first_name") as "first_name_count"
       * from "person"
       * ```
       */
      distinct() {
        return new _AggregateFunctionBuilder({
          ...this.#props,
          aggregateFunctionNode: AggregateFunctionNode.cloneWithDistinct(this.#props.aggregateFunctionNode)
        });
      }
      filterWhere(...args) {
        return new _AggregateFunctionBuilder({
          ...this.#props,
          aggregateFunctionNode: AggregateFunctionNode.cloneWithFilter(this.#props.aggregateFunctionNode, parseValueBinaryOperationOrExpression(args))
        });
      }
      /**
       * Adds a `filter` clause with a nested `where` clause after the function, where
       * both sides of the operator are references to columns.
       *
       * Similar to {@link WhereInterface}'s `whereRef` method.
       *
       * ### Examples
       *
       * Count people with same first and last names versus general public:
       *
       * ```ts
       * const result = await db
       *   .selectFrom('person')
       *   .select((eb) => [
       *     eb.fn
       *       .count<number>('id')
       *       .filterWhereRef('first_name', '=', 'last_name')
       *       .as('repeat_name_count'),
       *     eb.fn.count<number>('id').as('total_count'),
       *   ])
       *   .executeTakeFirstOrThrow()
       * ```
       *
       * The generated SQL (PostgreSQL):
       *
       * ```sql
       * select
       *   count("id") filter(where "first_name" = "last_name") as "repeat_name_count",
       *   count("id") as "total_count"
       * from "person"
       * ```
       */
      filterWhereRef(lhs, op, rhs) {
        return new _AggregateFunctionBuilder({
          ...this.#props,
          aggregateFunctionNode: AggregateFunctionNode.cloneWithFilter(this.#props.aggregateFunctionNode, parseReferentialBinaryOperation(lhs, op, rhs))
        });
      }
      /**
       * Adds an `over` clause (window functions) after the function.
       *
       * ### Examples
       *
       * ```ts
       * const result = await db
       *   .selectFrom('person')
       *   .select(
       *     (eb) => eb.fn.avg<number>('age').over().as('average_age')
       *   )
       *   .execute()
       * ```
       *
       * The generated SQL (PostgreSQL):
       *
       * ```sql
       * select avg("age") over() as "average_age"
       * from "person"
       * ```
       *
       * Also supports passing a callback that returns an over builder,
       * allowing to add partition by and sort by clauses inside over.
       *
       * ```ts
       * const result = await db
       *   .selectFrom('person')
       *   .select(
       *     (eb) => eb.fn.avg<number>('age').over(
       *       ob => ob.partitionBy('last_name').orderBy('first_name', 'asc')
       *     ).as('average_age')
       *   )
       *   .execute()
       * ```
       *
       * The generated SQL (PostgreSQL):
       *
       * ```sql
       * select avg("age") over(partition by "last_name" order by "first_name" asc) as "average_age"
       * from "person"
       * ```
       */
      over(over) {
        const builder = createOverBuilder();
        return new _AggregateFunctionBuilder({
          ...this.#props,
          aggregateFunctionNode: AggregateFunctionNode.cloneWithOver(this.#props.aggregateFunctionNode, (over ? over(builder) : builder).toOperationNode())
        });
      }
      /**
       * Simply calls the provided function passing `this` as the only argument. `$call` returns
       * what the provided function returns.
       */
      $call(func) {
        return func(this);
      }
      toOperationNode() {
        return this.#props.aggregateFunctionNode;
      }
    };
    preventAwait(AggregateFunctionBuilder, "don't await AggregateFunctionBuilder instances. They are never executed directly and are always just a part of a query.");
    AliasedAggregateFunctionBuilder = class {
      #aggregateFunctionBuilder;
      #alias;
      constructor(aggregateFunctionBuilder, alias) {
        this.#aggregateFunctionBuilder = aggregateFunctionBuilder;
        this.#alias = alias;
      }
      /** @private */
      get expression() {
        return this.#aggregateFunctionBuilder;
      }
      /** @private */
      get alias() {
        return this.#alias;
      }
      toOperationNode() {
        return AliasNode.create(this.#aggregateFunctionBuilder.toOperationNode(), IdentifierNode.create(this.#alias));
      }
    };
  }
});

// node_modules/kysely/dist/esm/query-builder/function-module.js
function createFunctionModule() {
  const fn = (name, args) => {
    return new ExpressionWrapper(FunctionNode.create(name, parseReferenceExpressionOrList(args)));
  };
  const agg = (name, args) => {
    return new AggregateFunctionBuilder({
      aggregateFunctionNode: AggregateFunctionNode.create(name, args ? parseReferenceExpressionOrList(args) : void 0)
    });
  };
  return Object.assign(fn, {
    agg,
    avg(column) {
      return agg("avg", [column]);
    },
    coalesce(value, ...otherValues) {
      return fn("coalesce", [value, ...otherValues]);
    },
    count(column) {
      return agg("count", [column]);
    },
    countAll(table) {
      return new AggregateFunctionBuilder({
        aggregateFunctionNode: AggregateFunctionNode.create("count", parseSelectAll(table))
      });
    },
    max(column) {
      return agg("max", [column]);
    },
    min(column) {
      return agg("min", [column]);
    },
    sum(column) {
      return agg("sum", [column]);
    },
    any(column) {
      return fn("any", [column]);
    }
  });
}
var init_function_module = __esm({
  "node_modules/kysely/dist/esm/query-builder/function-module.js"() {
    init_expression_wrapper();
    init_aggregate_function_node();
    init_function_node();
    init_reference_parser();
    init_select_parser();
    init_aggregate_function_builder();
  }
});

// node_modules/kysely/dist/esm/operation-node/unary-operation-node.js
var UnaryOperationNode;
var init_unary_operation_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/unary-operation-node.js"() {
    init_object_utils();
    UnaryOperationNode = freeze({
      is(node) {
        return node.kind === "UnaryOperationNode";
      },
      create(operator, operand) {
        return freeze({
          kind: "UnaryOperationNode",
          operator,
          operand
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/parser/unary-operation-parser.js
function parseUnaryOperation(operator, operand) {
  return UnaryOperationNode.create(OperatorNode.create(operator), parseReferenceExpression(operand));
}
var init_unary_operation_parser = __esm({
  "node_modules/kysely/dist/esm/parser/unary-operation-parser.js"() {
    init_operator_node();
    init_unary_operation_node();
    init_reference_parser();
  }
});

// node_modules/kysely/dist/esm/operation-node/when-node.js
var WhenNode;
var init_when_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/when-node.js"() {
    init_object_utils();
    WhenNode = freeze({
      is(node) {
        return node.kind === "WhenNode";
      },
      create(condition) {
        return freeze({
          kind: "WhenNode",
          condition
        });
      },
      cloneWithResult(whenNode, result) {
        return freeze({
          ...whenNode,
          result
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/case-node.js
var CaseNode;
var init_case_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/case-node.js"() {
    init_object_utils();
    init_when_node();
    CaseNode = freeze({
      is(node) {
        return node.kind === "CaseNode";
      },
      create(value) {
        return freeze({
          kind: "CaseNode",
          value
        });
      },
      cloneWithWhen(caseNode, when) {
        return freeze({
          ...caseNode,
          when: freeze(caseNode.when ? [...caseNode.when, when] : [when])
        });
      },
      cloneWithThen(caseNode, then) {
        return freeze({
          ...caseNode,
          when: caseNode.when ? freeze([
            ...caseNode.when.slice(0, -1),
            WhenNode.cloneWithResult(caseNode.when[caseNode.when.length - 1], then)
          ]) : void 0
        });
      },
      cloneWith(caseNode, props) {
        return freeze({
          ...caseNode,
          ...props
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/query-builder/case-builder.js
var CaseBuilder, CaseThenBuilder, CaseWhenBuilder, CaseEndBuilder;
var init_case_builder = __esm({
  "node_modules/kysely/dist/esm/query-builder/case-builder.js"() {
    init_expression_wrapper();
    init_object_utils();
    init_case_node();
    init_when_node();
    init_binary_operation_parser();
    init_value_parser();
    CaseBuilder = class {
      #props;
      constructor(props) {
        this.#props = freeze(props);
      }
      when(...args) {
        return new CaseThenBuilder({
          ...this.#props,
          node: CaseNode.cloneWithWhen(this.#props.node, WhenNode.create(parseValueBinaryOperationOrExpression(args)))
        });
      }
    };
    CaseThenBuilder = class {
      #props;
      constructor(props) {
        this.#props = freeze(props);
      }
      then(valueExpression) {
        return new CaseWhenBuilder({
          ...this.#props,
          node: CaseNode.cloneWithThen(this.#props.node, isSafeImmediateValue(valueExpression) ? parseSafeImmediateValue(valueExpression) : parseValueExpression(valueExpression))
        });
      }
    };
    CaseWhenBuilder = class {
      #props;
      constructor(props) {
        this.#props = freeze(props);
      }
      when(...args) {
        return new CaseThenBuilder({
          ...this.#props,
          node: CaseNode.cloneWithWhen(this.#props.node, WhenNode.create(parseValueBinaryOperationOrExpression(args)))
        });
      }
      else(valueExpression) {
        return new CaseEndBuilder({
          ...this.#props,
          node: CaseNode.cloneWith(this.#props.node, {
            else: isSafeImmediateValue(valueExpression) ? parseSafeImmediateValue(valueExpression) : parseValueExpression(valueExpression)
          })
        });
      }
      end() {
        return new ExpressionWrapper(CaseNode.cloneWith(this.#props.node, { isStatement: false }));
      }
      endCase() {
        return new ExpressionWrapper(CaseNode.cloneWith(this.#props.node, { isStatement: true }));
      }
    };
    CaseEndBuilder = class {
      #props;
      constructor(props) {
        this.#props = freeze(props);
      }
      end() {
        return new ExpressionWrapper(CaseNode.cloneWith(this.#props.node, { isStatement: false }));
      }
      endCase() {
        return new ExpressionWrapper(CaseNode.cloneWith(this.#props.node, { isStatement: true }));
      }
    };
  }
});

// node_modules/kysely/dist/esm/operation-node/json-path-leg-node.js
var JSONPathLegNode;
var init_json_path_leg_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/json-path-leg-node.js"() {
    init_object_utils();
    JSONPathLegNode = freeze({
      is(node) {
        return node.kind === "JSONPathLegNode";
      },
      create(type, value) {
        return freeze({
          kind: "JSONPathLegNode",
          type,
          value
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/query-builder/json-path-builder.js
var JSONPathBuilder, TraversedJSONPathBuilder, AliasedJSONPathBuilder;
var init_json_path_builder = __esm({
  "node_modules/kysely/dist/esm/query-builder/json-path-builder.js"() {
    init_alias_node();
    init_identifier_node();
    init_json_operator_chain_node();
    init_json_path_leg_node();
    init_json_path_node();
    init_json_reference_node();
    init_operation_node_source();
    init_value_node();
    JSONPathBuilder = class {
      #node;
      constructor(node) {
        this.#node = node;
      }
      /**
       * Access an element of a JSON array in a specific location.
       *
       * Since there's no guarantee an element exists in the given array location, the
       * resulting type is always nullable. If you're sure the element exists, you
       * should use {@link SelectQueryBuilder.$assertType} to narrow the type safely.
       *
       * See also {@link key} to access properties of JSON objects.
       *
       * ### Examples
       *
       * ```ts
       * db.selectFrom('person').select(eb =>
       *   eb.ref('nicknames', '->').at(0).as('primary_nickname')
       * )
       *
       * The generated SQL (PostgreSQL):
       *
       * ```sql
       * select "nicknames"->0 as "primary_nickname" from "person"
       *```
       *
       * Combined with {@link key}:
       *
       * ```ts
       * db.selectFrom('person').select(eb =>
       *   eb.ref('experience', '->').at(0).key('role').as('first_role')
       * )
       * ```
       *
       * The generated SQL (PostgreSQL):
       *
       * ```sql
       * select "experience"->0->'role' as "first_role" from "person"
       * ```
       *
       * You can use `'last'` to access the last element of the array in MySQL:
       *
       * ```ts
       * db.selectFrom('person').select(eb =>
       *   eb.ref('nicknames', '->$').at('last').as('last_nickname')
       * )
       * ```
       *
       * The generated SQL (MySQL):
       *
       * ```sql
       * select `nicknames`->'$[last]' as `last_nickname` from `person`
       * ```
       *
       * Or `'#-1'` in SQLite:
       *
       * ```ts
       * db.selectFrom('person').select(eb =>
       *   eb.ref('nicknames', '->>$').at('#-1').as('last_nickname')
       * )
       * ```
       *
       * The generated SQL (SQLite):
       *
       * ```sql
       * select "nicknames"->>'$[#-1]' as `last_nickname` from `person`
       * ```
       */
      at(index) {
        return this.#createBuilderWithPathLeg("ArrayLocation", index);
      }
      /**
       * Access a property of a JSON object.
       *
       * If a field is optional, the resulting type will be nullable.
       *
       * See also {@link at} to access elements of JSON arrays.
       *
       * ### Examples
       *
       * ```ts
       * db.selectFrom('person').select(eb =>
       *   eb.ref('address', '->').key('city').as('city')
       * )
       * ```
       *
       * The generated SQL (PostgreSQL):
       *
       * ```sql
       * select "address"->'city' as "city" from "person"
       * ```
       *
       * Going deeper:
       *
       * ```ts
       * db.selectFrom('person').select(eb =>
       *   eb.ref('profile', '->$').key('website').key('url').as('website_url')
       * )
       * ```
       *
       * The generated SQL (MySQL):
       *
       * ```sql
       * select `profile`->'$.website.url' as `website_url` from `person`
       * ```
       *
       * Combined with {@link at}:
       *
       * ```ts
       * db.selectFrom('person').select(eb =>
       *   eb.ref('profile', '->').key('addresses').at(0).key('city').as('city')
       * )
       * ```
       *
       * The generated SQL (PostgreSQL):
       *
       * ```sql
       * select "profile"->'addresses'->0->'city' as "city" from "person"
       * ```
       */
      key(key) {
        return this.#createBuilderWithPathLeg("Member", key);
      }
      #createBuilderWithPathLeg(legType, value) {
        return new TraversedJSONPathBuilder(JSONReferenceNode.cloneWithTraversal(this.#node, JSONPathNode.is(this.#node.traversal) ? JSONPathNode.cloneWithLeg(this.#node.traversal, JSONPathLegNode.create(legType, value)) : JSONOperatorChainNode.cloneWithValue(this.#node.traversal, ValueNode.createImmediate(value))));
      }
    };
    TraversedJSONPathBuilder = class extends JSONPathBuilder {
      #node;
      constructor(node) {
        super(node);
        this.#node = node;
      }
      /** @private */
      get expressionType() {
        return void 0;
      }
      as(alias) {
        return new AliasedJSONPathBuilder(this, alias);
      }
      /**
       * Change the output type of the json path.
       *
       * This method call doesn't change the SQL in any way. This methods simply
       * returns a copy of this `JSONPathBuilder` with a new output type.
       */
      $castTo() {
        return new JSONPathBuilder(this.#node);
      }
      toOperationNode() {
        return this.#node;
      }
    };
    AliasedJSONPathBuilder = class {
      #jsonPath;
      #alias;
      constructor(jsonPath, alias) {
        this.#jsonPath = jsonPath;
        this.#alias = alias;
      }
      /** @private */
      get expression() {
        return this.#jsonPath;
      }
      /** @private */
      get alias() {
        return this.#alias;
      }
      toOperationNode() {
        return AliasNode.create(this.#jsonPath.toOperationNode(), isOperationNodeSource(this.#alias) ? this.#alias.toOperationNode() : IdentifierNode.create(this.#alias));
      }
    };
  }
});

// node_modules/kysely/dist/esm/operation-node/tuple-node.js
var TupleNode;
var init_tuple_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/tuple-node.js"() {
    init_object_utils();
    TupleNode = freeze({
      is(node) {
        return node.kind === "TupleNode";
      },
      create(values) {
        return freeze({
          kind: "TupleNode",
          values: freeze(values)
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/expression/expression-builder.js
function createExpressionBuilder(executor = NOOP_QUERY_EXECUTOR) {
  function binary(lhs, op, rhs) {
    return new ExpressionWrapper(parseValueBinaryOperation(lhs, op, rhs));
  }
  function unary(op, expr) {
    return new ExpressionWrapper(parseUnaryOperation(op, expr));
  }
  const eb = Object.assign(binary, {
    fn: void 0,
    eb: void 0,
    selectFrom(table) {
      return createSelectQueryBuilder({
        queryId: createQueryId(),
        executor,
        queryNode: SelectQueryNode.createFrom(parseTableExpressionOrList(table))
      });
    },
    selectNoFrom(selection) {
      return createSelectQueryBuilder({
        queryId: createQueryId(),
        executor,
        queryNode: SelectQueryNode.cloneWithSelections(SelectQueryNode.create(), parseSelectArg(selection))
      });
    },
    case(reference) {
      return new CaseBuilder({
        node: CaseNode.create(isUndefined3(reference) ? void 0 : parseReferenceExpression(reference))
      });
    },
    ref(reference, op) {
      if (isUndefined3(op)) {
        return new ExpressionWrapper(parseStringReference(reference));
      }
      return new JSONPathBuilder(parseJSONReference(reference, op));
    },
    val(value) {
      return new ExpressionWrapper(parseValueExpressionOrList(value));
    },
    refTuple(...values) {
      return new ExpressionWrapper(TupleNode.create(values.map(parseReferenceExpression)));
    },
    tuple(...values) {
      return new ExpressionWrapper(TupleNode.create(values.map(parseValueExpression)));
    },
    lit(value) {
      return new ExpressionWrapper(parseSafeImmediateValue(value));
    },
    // @deprecated
    cmpr(lhs, op, rhs) {
      return new ExpressionWrapper(parseValueBinaryOperation(lhs, op, rhs));
    },
    // @deprecated
    bxp(lhs, op, rhs) {
      return new ExpressionWrapper(parseValueBinaryOperation(lhs, op, rhs));
    },
    unary,
    not(expr) {
      return unary("not", expr);
    },
    exists(expr) {
      return unary("exists", expr);
    },
    neg(expr) {
      return unary("-", expr);
    },
    between(expr, start, end) {
      return new ExpressionWrapper(BinaryOperationNode.create(parseReferenceExpression(expr), OperatorNode.create("between"), AndNode.create(parseValueExpression(start), parseValueExpression(end))));
    },
    betweenSymmetric(expr, start, end) {
      return new ExpressionWrapper(BinaryOperationNode.create(parseReferenceExpression(expr), OperatorNode.create("between symmetric"), AndNode.create(parseValueExpression(start), parseValueExpression(end))));
    },
    and(exprs) {
      if (isReadonlyArray(exprs)) {
        return new ExpressionWrapper(parseFilterList(exprs, "and"));
      }
      return new ExpressionWrapper(parseFilterObject(exprs, "and"));
    },
    or(exprs) {
      if (isReadonlyArray(exprs)) {
        return new ExpressionWrapper(parseFilterList(exprs, "or"));
      }
      return new ExpressionWrapper(parseFilterObject(exprs, "or"));
    },
    parens(...args) {
      const node = parseValueBinaryOperationOrExpression(args);
      if (ParensNode.is(node)) {
        return new ExpressionWrapper(node);
      } else {
        return new ExpressionWrapper(ParensNode.create(node));
      }
    },
    withSchema(schema9) {
      return createExpressionBuilder(executor.withPluginAtFront(new WithSchemaPlugin(schema9)));
    }
  });
  eb.fn = createFunctionModule();
  eb.eb = eb;
  return eb;
}
function expressionBuilder(_) {
  return createExpressionBuilder();
}
var init_expression_builder = __esm({
  "node_modules/kysely/dist/esm/expression/expression-builder.js"() {
    init_select_query_builder();
    init_select_query_node();
    init_table_parser();
    init_with_schema_plugin();
    init_query_id();
    init_function_module();
    init_reference_parser();
    init_binary_operation_parser();
    init_parens_node();
    init_expression_wrapper();
    init_operator_node();
    init_unary_operation_parser();
    init_value_parser();
    init_noop_query_executor();
    init_case_builder();
    init_case_node();
    init_object_utils();
    init_json_path_builder();
    init_binary_operation_node();
    init_and_node();
    init_select_parser();
    init_tuple_node();
  }
});

// node_modules/kysely/dist/esm/parser/expression-parser.js
function parseExpression(exp) {
  if (isOperationNodeSource(exp)) {
    return exp.toOperationNode();
  } else if (isFunction(exp)) {
    return exp(expressionBuilder()).toOperationNode();
  }
  throw new Error(`invalid expression: ${JSON.stringify(exp)}`);
}
function parseAliasedExpression(exp) {
  if (isOperationNodeSource(exp)) {
    return exp.toOperationNode();
  } else if (isFunction(exp)) {
    return exp(expressionBuilder()).toOperationNode();
  }
  throw new Error(`invalid aliased expression: ${JSON.stringify(exp)}`);
}
function isExpressionOrFactory(obj) {
  return isExpression(obj) || isAliasedExpression(obj) || isFunction(obj);
}
var init_expression_parser = __esm({
  "node_modules/kysely/dist/esm/parser/expression-parser.js"() {
    init_expression();
    init_operation_node_source();
    init_expression_builder();
    init_object_utils();
  }
});

// node_modules/kysely/dist/esm/parser/table-parser.js
function parseTableExpressionOrList(table) {
  if (isReadonlyArray(table)) {
    return table.map((it) => parseTableExpression(it));
  } else {
    return [parseTableExpression(table)];
  }
}
function parseTableExpression(table) {
  if (isString2(table)) {
    return parseAliasedTable(table);
  } else {
    return parseAliasedExpression(table);
  }
}
function parseAliasedTable(from) {
  const ALIAS_SEPARATOR = " as ";
  if (from.includes(ALIAS_SEPARATOR)) {
    const [table, alias] = from.split(ALIAS_SEPARATOR).map(trim2);
    return AliasNode.create(parseTable(table), IdentifierNode.create(alias));
  } else {
    return parseTable(from);
  }
}
function parseTable(from) {
  const SCHEMA_SEPARATOR = ".";
  if (from.includes(SCHEMA_SEPARATOR)) {
    const [schema9, table] = from.split(SCHEMA_SEPARATOR).map(trim2);
    return TableNode.createWithSchema(schema9, table);
  } else {
    return TableNode.create(from);
  }
}
function trim2(str) {
  return str.trim();
}
var init_table_parser = __esm({
  "node_modules/kysely/dist/esm/parser/table-parser.js"() {
    init_object_utils();
    init_alias_node();
    init_table_node();
    init_expression_parser();
    init_identifier_node();
  }
});

// node_modules/kysely/dist/esm/operation-node/add-column-node.js
var AddColumnNode;
var init_add_column_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/add-column-node.js"() {
    init_object_utils();
    AddColumnNode = freeze({
      is(node) {
        return node.kind === "AddColumnNode";
      },
      create(column) {
        return freeze({
          kind: "AddColumnNode",
          column
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/column-definition-node.js
var ColumnDefinitionNode;
var init_column_definition_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/column-definition-node.js"() {
    init_object_utils();
    init_column_node();
    ColumnDefinitionNode = freeze({
      is(node) {
        return node.kind === "ColumnDefinitionNode";
      },
      create(column, dataType) {
        return freeze({
          kind: "ColumnDefinitionNode",
          column: ColumnNode.create(column),
          dataType
        });
      },
      cloneWithFrontModifier(node, modifier) {
        return freeze({
          ...node,
          frontModifiers: node.frontModifiers ? freeze([...node.frontModifiers, modifier]) : [modifier]
        });
      },
      cloneWithEndModifier(node, modifier) {
        return freeze({
          ...node,
          endModifiers: node.endModifiers ? freeze([...node.endModifiers, modifier]) : [modifier]
        });
      },
      cloneWith(node, props) {
        return freeze({
          ...node,
          ...props
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/drop-column-node.js
var DropColumnNode;
var init_drop_column_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/drop-column-node.js"() {
    init_object_utils();
    init_column_node();
    DropColumnNode = freeze({
      is(node) {
        return node.kind === "DropColumnNode";
      },
      create(column) {
        return freeze({
          kind: "DropColumnNode",
          column: ColumnNode.create(column)
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/rename-column-node.js
var RenameColumnNode;
var init_rename_column_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/rename-column-node.js"() {
    init_object_utils();
    init_column_node();
    RenameColumnNode = freeze({
      is(node) {
        return node.kind === "RenameColumnNode";
      },
      create(column, newColumn) {
        return freeze({
          kind: "RenameColumnNode",
          column: ColumnNode.create(column),
          renameTo: ColumnNode.create(newColumn)
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/check-constraint-node.js
var CheckConstraintNode;
var init_check_constraint_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/check-constraint-node.js"() {
    init_object_utils();
    init_identifier_node();
    CheckConstraintNode = freeze({
      is(node) {
        return node.kind === "CheckConstraintNode";
      },
      create(expression, constraintName) {
        return freeze({
          kind: "CheckConstraintNode",
          expression,
          name: constraintName ? IdentifierNode.create(constraintName) : void 0
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/references-node.js
var ON_MODIFY_FOREIGN_ACTIONS, ReferencesNode;
var init_references_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/references-node.js"() {
    init_object_utils();
    ON_MODIFY_FOREIGN_ACTIONS = [
      "no action",
      "restrict",
      "cascade",
      "set null",
      "set default"
    ];
    ReferencesNode = freeze({
      is(node) {
        return node.kind === "ReferencesNode";
      },
      create(table, columns) {
        return freeze({
          kind: "ReferencesNode",
          table,
          columns: freeze([...columns])
        });
      },
      cloneWithOnDelete(references, onDelete) {
        return freeze({
          ...references,
          onDelete
        });
      },
      cloneWithOnUpdate(references, onUpdate) {
        return freeze({
          ...references,
          onUpdate
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/parser/default-value-parser.js
function parseDefaultValueExpression(value) {
  return isOperationNodeSource(value) ? value.toOperationNode() : ValueNode.createImmediate(value);
}
var init_default_value_parser = __esm({
  "node_modules/kysely/dist/esm/parser/default-value-parser.js"() {
    init_operation_node_source();
    init_value_node();
  }
});

// node_modules/kysely/dist/esm/operation-node/generated-node.js
var GeneratedNode;
var init_generated_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/generated-node.js"() {
    init_object_utils();
    GeneratedNode = freeze({
      is(node) {
        return node.kind === "GeneratedNode";
      },
      create(params) {
        return freeze({
          kind: "GeneratedNode",
          ...params
        });
      },
      createWithExpression(expression) {
        return freeze({
          kind: "GeneratedNode",
          always: true,
          expression
        });
      },
      cloneWith(node, params) {
        return freeze({
          ...node,
          ...params
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/default-value-node.js
var DefaultValueNode;
var init_default_value_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/default-value-node.js"() {
    init_object_utils();
    DefaultValueNode = freeze({
      is(node) {
        return node.kind === "DefaultValueNode";
      },
      create(defaultValue) {
        return freeze({
          kind: "DefaultValueNode",
          defaultValue
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/parser/on-modify-action-parser.js
function parseOnModifyForeignAction(action) {
  if (ON_MODIFY_FOREIGN_ACTIONS.includes(action)) {
    return action;
  }
  throw new Error(`invalid OnModifyForeignAction ${action}`);
}
var init_on_modify_action_parser = __esm({
  "node_modules/kysely/dist/esm/parser/on-modify-action-parser.js"() {
    init_references_node();
  }
});

// node_modules/kysely/dist/esm/schema/column-definition-builder.js
var ColumnDefinitionBuilder;
var init_column_definition_builder = __esm({
  "node_modules/kysely/dist/esm/schema/column-definition-builder.js"() {
    init_check_constraint_node();
    init_references_node();
    init_select_all_node();
    init_reference_parser();
    init_prevent_await();
    init_column_definition_node();
    init_default_value_parser();
    init_generated_node();
    init_default_value_node();
    init_on_modify_action_parser();
    ColumnDefinitionBuilder = class _ColumnDefinitionBuilder {
      #node;
      constructor(node) {
        this.#node = node;
      }
      /**
       * Adds `auto_increment` or `autoincrement` to the column definition
       * depending on the dialect.
       *
       * Some dialects like PostgreSQL don't support this. On PostgreSQL
       * you can use the `serial` or `bigserial` data type instead.
       */
      autoIncrement() {
        return new _ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { autoIncrement: true }));
      }
      /**
       * Makes the column the primary key.
       *
       * If you want to specify a composite primary key use the
       * {@link CreateTableBuilder.addPrimaryKeyConstraint} method.
       */
      primaryKey() {
        return new _ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { primaryKey: true }));
      }
      /**
       * Adds a foreign key constraint for the column.
       *
       * If your database engine doesn't support foreign key constraints in the
       * column definition (like MySQL 5) you need to call the table level
       * {@link CreateTableBuilder.addForeignKeyConstraint} method instead.
       *
       * ### Examples
       *
       * ```ts
       * col.references('person.id')
       * ```
       */
      references(ref) {
        const references = parseStringReference(ref);
        if (!references.table || SelectAllNode.is(references.column)) {
          throw new Error(`invalid call references('${ref}'). The reference must have format table.column or schema.table.column`);
        }
        return new _ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, {
          references: ReferencesNode.create(references.table, [
            references.column
          ])
        }));
      }
      /**
       * Adds an `on delete` constraint for the foreign key column.
       *
       * If your database engine doesn't support foreign key constraints in the
       * column definition (like MySQL 5) you need to call the table level
       * {@link CreateTableBuilder.addForeignKeyConstraint} method instead.
       *
       * ### Examples
       *
       * ```ts
       * col.references('person.id').onDelete('cascade')
       * ```
       */
      onDelete(onDelete) {
        if (!this.#node.references) {
          throw new Error("on delete constraint can only be added for foreign keys");
        }
        return new _ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, {
          references: ReferencesNode.cloneWithOnDelete(this.#node.references, parseOnModifyForeignAction(onDelete))
        }));
      }
      /**
       * Adds an `on update` constraint for the foreign key column.
       *
       * ### Examples
       *
       * ```ts
       * col.references('person.id').onUpdate('cascade')
       * ```
       */
      onUpdate(onUpdate) {
        if (!this.#node.references) {
          throw new Error("on update constraint can only be added for foreign keys");
        }
        return new _ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, {
          references: ReferencesNode.cloneWithOnUpdate(this.#node.references, parseOnModifyForeignAction(onUpdate))
        }));
      }
      /**
       * Adds a unique constraint for the column.
       */
      unique() {
        return new _ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { unique: true }));
      }
      /**
       * Adds a `not null` constraint for the column.
       */
      notNull() {
        return new _ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { notNull: true }));
      }
      /**
       * Adds a `unsigned` modifier for the column.
       *
       * This only works on some dialects like MySQL.
       */
      unsigned() {
        return new _ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { unsigned: true }));
      }
      /**
       * Adds a default value constraint for the column.
       *
       * ### Examples
       *
       * ```ts
       * db.schema
       *   .createTable('pet')
       *   .addColumn('number_of_legs', 'integer', (col) => col.defaultTo(4))
       *   .execute()
       * ```
       *
       * Values passed to `defaultTo` are interpreted as value literals by default. You can define
       * an arbitrary SQL expression using the {@link sql} template tag:
       *
       * ```ts
       * import { sql } from 'kysely'
       *
       * db.schema
       *   .createTable('pet')
       *   .addColumn(
       *     'number_of_legs',
       *     'integer',
       *     (col) => col.defaultTo(sql`any SQL here`)
       *   )
       *   .execute()
       * ```
       */
      defaultTo(value) {
        return new _ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, {
          defaultTo: DefaultValueNode.create(parseDefaultValueExpression(value))
        }));
      }
      /**
       * Adds a check constraint for the column.
       *
       * ### Examples
       *
       * ```ts
       * import { sql } from 'kysely'
       *
       * db.schema
       *   .createTable('pet')
       *   .addColumn('number_of_legs', 'integer', (col) =>
       *     col.check(sql`number_of_legs < 5`)
       *   )
       *   .execute()
       * ```
       */
      check(expression) {
        return new _ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, {
          check: CheckConstraintNode.create(expression.toOperationNode())
        }));
      }
      /**
       * Makes the column a generated column using a `generated always as` statement.
       *
       * ### Examples
       *
       * ```ts
       * import { sql } from 'kysely'
       *
       * db.schema
       *   .createTable('person')
       *   .addColumn('full_name', 'varchar(255)',
       *     (col) => col.generatedAlwaysAs(sql`concat(first_name, ' ', last_name)`)
       *   )
       *   .execute()
       * ```
       */
      generatedAlwaysAs(expression) {
        return new _ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, {
          generated: GeneratedNode.createWithExpression(expression.toOperationNode())
        }));
      }
      /**
       * Adds the `generated always as identity` specifier on supported dialects.
       */
      generatedAlwaysAsIdentity() {
        return new _ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, {
          generated: GeneratedNode.create({ identity: true, always: true })
        }));
      }
      /**
       * Adds the `generated by default as identity` specifier on supported dialects.
       */
      generatedByDefaultAsIdentity() {
        return new _ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, {
          generated: GeneratedNode.create({ identity: true, byDefault: true })
        }));
      }
      /**
       * Makes a generated column stored instead of virtual. This method can only
       * be used with {@link generatedAlwaysAs}
       *
       * ### Examples
       *
       * ```ts
       * db.schema
       *   .createTable('person')
       *   .addColumn('full_name', 'varchar(255)', (col) => col
       *     .generatedAlwaysAs("concat(first_name, ' ', last_name)")
       *     .stored()
       *   )
       *   .execute()
       * ```
       */
      stored() {
        if (!this.#node.generated) {
          throw new Error("stored() can only be called after generatedAlwaysAs");
        }
        return new _ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, {
          generated: GeneratedNode.cloneWith(this.#node.generated, {
            stored: true
          })
        }));
      }
      /**
       * This can be used to add any additional SQL right after the column's data type.
       *
       * ### Examples
       *
       * ```ts
       * db.schema.createTable('person')
       *  .addColumn('id', 'integer', col => col.primaryKey())
       *  .addColumn('first_name', 'varchar(36)', col => col.modifyFront(sql`collate utf8mb4_general_ci`).notNull())
       *  .execute()
       * ```
       *
       * The generated SQL (MySQL):
       *
       * ```sql
       * create table `person` (
       *   `id` integer primary key,
       *   `first_name` varchar(36) collate utf8mb4_general_ci not null
       * )
       * ```
       */
      modifyFront(modifier) {
        return new _ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWithFrontModifier(this.#node, modifier.toOperationNode()));
      }
      /**
       * This can be used to add any additional SQL to the end of the column definition.
       *
       * ### Examples
       *
       * ```ts
       * db.schema.createTable('person')
       *  .addColumn('id', 'integer', col => col.primaryKey())
       *  .addColumn('age', 'integer', col => col.unsigned().notNull().modifyEnd(sql`comment ${sql.lit('it is not polite to ask a woman her age')}`))
       *  .execute()
       * ```
       *
       * The generated SQL (MySQL):
       *
       * ```sql
       * create table `person` (
       *   `id` integer primary key,
       *   `age` integer unsigned not null comment 'it is not polite to ask a woman her age'
       * )
       * ```
       */
      modifyEnd(modifier) {
        return new _ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWithEndModifier(this.#node, modifier.toOperationNode()));
      }
      /**
       * Simply calls the provided function passing `this` as the only argument. `$call` returns
       * what the provided function returns.
       */
      $call(func) {
        return func(this);
      }
      toOperationNode() {
        return this.#node;
      }
    };
    preventAwait(ColumnDefinitionBuilder, "don't await ColumnDefinitionBuilder instances directly.");
  }
});

// node_modules/kysely/dist/esm/operation-node/modify-column-node.js
var ModifyColumnNode;
var init_modify_column_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/modify-column-node.js"() {
    init_object_utils();
    ModifyColumnNode = freeze({
      is(node) {
        return node.kind === "ModifyColumnNode";
      },
      create(column) {
        return freeze({
          kind: "ModifyColumnNode",
          column
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/data-type-node.js
var DataTypeNode;
var init_data_type_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/data-type-node.js"() {
    init_object_utils();
    DataTypeNode = freeze({
      is(node) {
        return node.kind === "DataTypeNode";
      },
      create(dataType) {
        return freeze({
          kind: "DataTypeNode",
          dataType
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/parser/data-type-parser.js
function parseDataTypeExpression(dataType) {
  return isOperationNodeSource(dataType) ? dataType.toOperationNode() : DataTypeNode.create(dataType);
}
var init_data_type_parser = __esm({
  "node_modules/kysely/dist/esm/parser/data-type-parser.js"() {
    init_data_type_node();
    init_operation_node_source();
  }
});

// node_modules/kysely/dist/esm/operation-node/foreign-key-constraint-node.js
var ForeignKeyConstraintNode;
var init_foreign_key_constraint_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/foreign-key-constraint-node.js"() {
    init_object_utils();
    init_identifier_node();
    init_references_node();
    ForeignKeyConstraintNode = freeze({
      is(node) {
        return node.kind === "ForeignKeyConstraintNode";
      },
      create(sourceColumns, targetTable, targetColumns, constraintName) {
        return freeze({
          kind: "ForeignKeyConstraintNode",
          columns: sourceColumns,
          references: ReferencesNode.create(targetTable, targetColumns),
          name: constraintName ? IdentifierNode.create(constraintName) : void 0
        });
      },
      cloneWith(node, props) {
        return freeze({
          ...node,
          ...props
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/schema/foreign-key-constraint-builder.js
var ForeignKeyConstraintBuilder;
var init_foreign_key_constraint_builder = __esm({
  "node_modules/kysely/dist/esm/schema/foreign-key-constraint-builder.js"() {
    init_foreign_key_constraint_node();
    init_on_modify_action_parser();
    init_prevent_await();
    ForeignKeyConstraintBuilder = class _ForeignKeyConstraintBuilder {
      #node;
      constructor(node) {
        this.#node = node;
      }
      onDelete(onDelete) {
        return new _ForeignKeyConstraintBuilder(ForeignKeyConstraintNode.cloneWith(this.#node, {
          onDelete: parseOnModifyForeignAction(onDelete)
        }));
      }
      onUpdate(onUpdate) {
        return new _ForeignKeyConstraintBuilder(ForeignKeyConstraintNode.cloneWith(this.#node, {
          onUpdate: parseOnModifyForeignAction(onUpdate)
        }));
      }
      /**
       * Simply calls the provided function passing `this` as the only argument. `$call` returns
       * what the provided function returns.
       */
      $call(func) {
        return func(this);
      }
      toOperationNode() {
        return this.#node;
      }
    };
    preventAwait(ForeignKeyConstraintBuilder, "don't await ForeignKeyConstraintBuilder instances directly.");
  }
});

// node_modules/kysely/dist/esm/operation-node/add-constraint-node.js
var AddConstraintNode;
var init_add_constraint_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/add-constraint-node.js"() {
    init_object_utils();
    AddConstraintNode = freeze({
      is(node) {
        return node.kind === "AddConstraintNode";
      },
      create(constraint) {
        return freeze({
          kind: "AddConstraintNode",
          constraint
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/unique-constraint-node.js
var UniqueConstraintNode;
var init_unique_constraint_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/unique-constraint-node.js"() {
    init_object_utils();
    init_column_node();
    init_identifier_node();
    UniqueConstraintNode = freeze({
      is(node) {
        return node.kind === "UniqueConstraintNode";
      },
      create(columns, constraintName) {
        return freeze({
          kind: "UniqueConstraintNode",
          columns: freeze(columns.map(ColumnNode.create)),
          name: constraintName ? IdentifierNode.create(constraintName) : void 0
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/drop-constraint-node.js
var DropConstraintNode;
var init_drop_constraint_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/drop-constraint-node.js"() {
    init_object_utils();
    init_identifier_node();
    DropConstraintNode = freeze({
      is(node) {
        return node.kind === "DropConstraintNode";
      },
      create(constraintName) {
        return freeze({
          kind: "DropConstraintNode",
          constraintName: IdentifierNode.create(constraintName)
        });
      },
      cloneWith(dropConstraint, props) {
        return freeze({
          ...dropConstraint,
          ...props
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/alter-column-node.js
var AlterColumnNode;
var init_alter_column_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/alter-column-node.js"() {
    init_object_utils();
    init_column_node();
    AlterColumnNode = freeze({
      is(node) {
        return node.kind === "AlterColumnNode";
      },
      create(column, prop, value) {
        return freeze({
          kind: "AlterColumnNode",
          column: ColumnNode.create(column),
          [prop]: value
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/schema/alter-column-builder.js
var AlterColumnBuilder, AlteredColumnBuilder;
var init_alter_column_builder = __esm({
  "node_modules/kysely/dist/esm/schema/alter-column-builder.js"() {
    init_alter_column_node();
    init_data_type_parser();
    init_default_value_parser();
    AlterColumnBuilder = class {
      #column;
      constructor(column) {
        this.#column = column;
      }
      setDataType(dataType) {
        return new AlteredColumnBuilder(AlterColumnNode.create(this.#column, "dataType", parseDataTypeExpression(dataType)));
      }
      setDefault(value) {
        return new AlteredColumnBuilder(AlterColumnNode.create(this.#column, "setDefault", parseDefaultValueExpression(value)));
      }
      dropDefault() {
        return new AlteredColumnBuilder(AlterColumnNode.create(this.#column, "dropDefault", true));
      }
      setNotNull() {
        return new AlteredColumnBuilder(AlterColumnNode.create(this.#column, "setNotNull", true));
      }
      dropNotNull() {
        return new AlteredColumnBuilder(AlterColumnNode.create(this.#column, "dropNotNull", true));
      }
      /**
       * Simply calls the provided function passing `this` as the only argument. `$call` returns
       * what the provided function returns.
       */
      $call(func) {
        return func(this);
      }
    };
    AlteredColumnBuilder = class {
      #alterColumnNode;
      constructor(alterColumnNode) {
        this.#alterColumnNode = alterColumnNode;
      }
      toOperationNode() {
        return this.#alterColumnNode;
      }
    };
  }
});

// node_modules/kysely/dist/esm/schema/alter-table-executor.js
var AlterTableExecutor;
var init_alter_table_executor = __esm({
  "node_modules/kysely/dist/esm/schema/alter-table-executor.js"() {
    init_object_utils();
    init_prevent_await();
    AlterTableExecutor = class {
      #props;
      constructor(props) {
        this.#props = freeze(props);
      }
      toOperationNode() {
        return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
      }
      compile() {
        return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
      }
      async execute() {
        await this.#props.executor.executeQuery(this.compile(), this.#props.queryId);
      }
    };
    preventAwait(AlterTableExecutor, "don't await AlterTableExecutor instances directly. To execute the query you need to call `execute`");
  }
});

// node_modules/kysely/dist/esm/schema/alter-table-add-foreign-key-constraint-builder.js
var AlterTableAddForeignKeyConstraintBuilder;
var init_alter_table_add_foreign_key_constraint_builder = __esm({
  "node_modules/kysely/dist/esm/schema/alter-table-add-foreign-key-constraint-builder.js"() {
    init_add_constraint_node();
    init_alter_table_node();
    init_object_utils();
    init_prevent_await();
    AlterTableAddForeignKeyConstraintBuilder = class _AlterTableAddForeignKeyConstraintBuilder {
      #props;
      constructor(props) {
        this.#props = freeze(props);
      }
      onDelete(onDelete) {
        return new _AlterTableAddForeignKeyConstraintBuilder({
          ...this.#props,
          constraintBuilder: this.#props.constraintBuilder.onDelete(onDelete)
        });
      }
      onUpdate(onUpdate) {
        return new _AlterTableAddForeignKeyConstraintBuilder({
          ...this.#props,
          constraintBuilder: this.#props.constraintBuilder.onUpdate(onUpdate)
        });
      }
      /**
       * Simply calls the provided function passing `this` as the only argument. `$call` returns
       * what the provided function returns.
       */
      $call(func) {
        return func(this);
      }
      toOperationNode() {
        return this.#props.executor.transformQuery(AlterTableNode.cloneWithTableProps(this.#props.node, {
          addConstraint: AddConstraintNode.create(this.#props.constraintBuilder.toOperationNode())
        }), this.#props.queryId);
      }
      compile() {
        return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
      }
      async execute() {
        await this.#props.executor.executeQuery(this.compile(), this.#props.queryId);
      }
    };
    preventAwait(AlterTableAddForeignKeyConstraintBuilder, "don't await AlterTableAddForeignKeyConstraintBuilder instances directly. To execute the query you need to call `execute`");
  }
});

// node_modules/kysely/dist/esm/schema/alter-table-drop-constraint-builder.js
var AlterTableDropConstraintBuilder;
var init_alter_table_drop_constraint_builder = __esm({
  "node_modules/kysely/dist/esm/schema/alter-table-drop-constraint-builder.js"() {
    init_alter_table_node();
    init_drop_constraint_node();
    init_object_utils();
    init_prevent_await();
    AlterTableDropConstraintBuilder = class _AlterTableDropConstraintBuilder {
      #props;
      constructor(props) {
        this.#props = freeze(props);
      }
      ifExists() {
        return new _AlterTableDropConstraintBuilder({
          ...this.#props,
          node: AlterTableNode.cloneWithTableProps(this.#props.node, {
            dropConstraint: DropConstraintNode.cloneWith(this.#props.node.dropConstraint, {
              ifExists: true
            })
          })
        });
      }
      cascade() {
        return new _AlterTableDropConstraintBuilder({
          ...this.#props,
          node: AlterTableNode.cloneWithTableProps(this.#props.node, {
            dropConstraint: DropConstraintNode.cloneWith(this.#props.node.dropConstraint, {
              modifier: "cascade"
            })
          })
        });
      }
      restrict() {
        return new _AlterTableDropConstraintBuilder({
          ...this.#props,
          node: AlterTableNode.cloneWithTableProps(this.#props.node, {
            dropConstraint: DropConstraintNode.cloneWith(this.#props.node.dropConstraint, {
              modifier: "restrict"
            })
          })
        });
      }
      /**
       * Simply calls the provided function passing `this` as the only argument. `$call` returns
       * what the provided function returns.
       */
      $call(func) {
        return func(this);
      }
      toOperationNode() {
        return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
      }
      compile() {
        return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
      }
      async execute() {
        await this.#props.executor.executeQuery(this.compile(), this.#props.queryId);
      }
    };
    preventAwait(AlterTableDropConstraintBuilder, "don't await AlterTableDropConstraintBuilder instances directly. To execute the query you need to call `execute`");
  }
});

// node_modules/kysely/dist/esm/operation-node/primary-constraint-node.js
var PrimaryConstraintNode;
var init_primary_constraint_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/primary-constraint-node.js"() {
    init_object_utils();
    init_column_node();
    init_identifier_node();
    PrimaryConstraintNode = freeze({
      is(node) {
        return node.kind === "PrimaryKeyConstraintNode";
      },
      create(columns, constraintName) {
        return freeze({
          kind: "PrimaryKeyConstraintNode",
          columns: freeze(columns.map(ColumnNode.create)),
          name: constraintName ? IdentifierNode.create(constraintName) : void 0
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/schema/alter-table-builder.js
var AlterTableBuilder, AlterTableColumnAlteringBuilder;
var init_alter_table_builder = __esm({
  "node_modules/kysely/dist/esm/schema/alter-table-builder.js"() {
    init_add_column_node();
    init_alter_table_node();
    init_column_definition_node();
    init_drop_column_node();
    init_identifier_node();
    init_rename_column_node();
    init_object_utils();
    init_prevent_await();
    init_column_definition_builder();
    init_modify_column_node();
    init_data_type_parser();
    init_foreign_key_constraint_builder();
    init_add_constraint_node();
    init_unique_constraint_node();
    init_check_constraint_node();
    init_foreign_key_constraint_node();
    init_column_node();
    init_table_parser();
    init_drop_constraint_node();
    init_alter_column_builder();
    init_alter_table_executor();
    init_alter_table_add_foreign_key_constraint_builder();
    init_alter_table_drop_constraint_builder();
    init_primary_constraint_node();
    AlterTableBuilder = class {
      #props;
      constructor(props) {
        this.#props = freeze(props);
      }
      renameTo(newTableName) {
        return new AlterTableExecutor({
          ...this.#props,
          node: AlterTableNode.cloneWithTableProps(this.#props.node, {
            renameTo: parseTable(newTableName)
          })
        });
      }
      setSchema(newSchema) {
        return new AlterTableExecutor({
          ...this.#props,
          node: AlterTableNode.cloneWithTableProps(this.#props.node, {
            setSchema: IdentifierNode.create(newSchema)
          })
        });
      }
      alterColumn(column, alteration) {
        const builder = alteration(new AlterColumnBuilder(column));
        return new AlterTableColumnAlteringBuilder({
          ...this.#props,
          node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, builder.toOperationNode())
        });
      }
      dropColumn(column) {
        return new AlterTableColumnAlteringBuilder({
          ...this.#props,
          node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, DropColumnNode.create(column))
        });
      }
      renameColumn(column, newColumn) {
        return new AlterTableColumnAlteringBuilder({
          ...this.#props,
          node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, RenameColumnNode.create(column, newColumn))
        });
      }
      addColumn(columnName, dataType, build = noop) {
        const builder = build(new ColumnDefinitionBuilder(ColumnDefinitionNode.create(columnName, parseDataTypeExpression(dataType))));
        return new AlterTableColumnAlteringBuilder({
          ...this.#props,
          node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, AddColumnNode.create(builder.toOperationNode()))
        });
      }
      modifyColumn(columnName, dataType, build = noop) {
        const builder = build(new ColumnDefinitionBuilder(ColumnDefinitionNode.create(columnName, parseDataTypeExpression(dataType))));
        return new AlterTableColumnAlteringBuilder({
          ...this.#props,
          node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, ModifyColumnNode.create(builder.toOperationNode()))
        });
      }
      /**
       * See {@link CreateTableBuilder.addUniqueConstraint}
       */
      addUniqueConstraint(constraintName, columns) {
        return new AlterTableExecutor({
          ...this.#props,
          node: AlterTableNode.cloneWithTableProps(this.#props.node, {
            addConstraint: AddConstraintNode.create(UniqueConstraintNode.create(columns, constraintName))
          })
        });
      }
      /**
       * See {@link CreateTableBuilder.addCheckConstraint}
       */
      addCheckConstraint(constraintName, checkExpression) {
        return new AlterTableExecutor({
          ...this.#props,
          node: AlterTableNode.cloneWithTableProps(this.#props.node, {
            addConstraint: AddConstraintNode.create(CheckConstraintNode.create(checkExpression.toOperationNode(), constraintName))
          })
        });
      }
      /**
       * See {@link CreateTableBuilder.addForeignKeyConstraint}
       *
       * Unlike {@link CreateTableBuilder.addForeignKeyConstraint} this method returns
       * the constraint builder and doesn't take a callback as the last argument. This
       * is because you can only add one column per `ALTER TABLE` query.
       */
      addForeignKeyConstraint(constraintName, columns, targetTable, targetColumns) {
        return new AlterTableAddForeignKeyConstraintBuilder({
          ...this.#props,
          constraintBuilder: new ForeignKeyConstraintBuilder(ForeignKeyConstraintNode.create(columns.map(ColumnNode.create), parseTable(targetTable), targetColumns.map(ColumnNode.create), constraintName))
        });
      }
      /**
       * See {@link CreateTableBuilder.addPrimaryKeyConstraint}
       */
      addPrimaryKeyConstraint(constraintName, columns) {
        return new AlterTableExecutor({
          ...this.#props,
          node: AlterTableNode.cloneWithTableProps(this.#props.node, {
            addConstraint: AddConstraintNode.create(PrimaryConstraintNode.create(columns, constraintName))
          })
        });
      }
      dropConstraint(constraintName) {
        return new AlterTableDropConstraintBuilder({
          ...this.#props,
          node: AlterTableNode.cloneWithTableProps(this.#props.node, {
            dropConstraint: DropConstraintNode.create(constraintName)
          })
        });
      }
      /**
       * Calls the given function passing `this` as the only argument.
       *
       * See {@link CreateTableBuilder.$call}
       */
      $call(func) {
        return func(this);
      }
    };
    AlterTableColumnAlteringBuilder = class _AlterTableColumnAlteringBuilder {
      #props;
      constructor(props) {
        this.#props = freeze(props);
      }
      alterColumn(column, alteration) {
        const builder = alteration(new AlterColumnBuilder(column));
        return new _AlterTableColumnAlteringBuilder({
          ...this.#props,
          node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, builder.toOperationNode())
        });
      }
      dropColumn(column) {
        return new _AlterTableColumnAlteringBuilder({
          ...this.#props,
          node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, DropColumnNode.create(column))
        });
      }
      renameColumn(column, newColumn) {
        return new _AlterTableColumnAlteringBuilder({
          ...this.#props,
          node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, RenameColumnNode.create(column, newColumn))
        });
      }
      addColumn(columnName, dataType, build = noop) {
        const builder = build(new ColumnDefinitionBuilder(ColumnDefinitionNode.create(columnName, parseDataTypeExpression(dataType))));
        return new _AlterTableColumnAlteringBuilder({
          ...this.#props,
          node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, AddColumnNode.create(builder.toOperationNode()))
        });
      }
      modifyColumn(columnName, dataType, build = noop) {
        const builder = build(new ColumnDefinitionBuilder(ColumnDefinitionNode.create(columnName, parseDataTypeExpression(dataType))));
        return new _AlterTableColumnAlteringBuilder({
          ...this.#props,
          node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, ModifyColumnNode.create(builder.toOperationNode()))
        });
      }
      toOperationNode() {
        return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
      }
      compile() {
        return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
      }
      async execute() {
        await this.#props.executor.executeQuery(this.compile(), this.#props.queryId);
      }
    };
    preventAwait(AlterTableBuilder, "don't await AlterTableBuilder instances");
    preventAwait(AlterColumnBuilder, "don't await AlterColumnBuilder instances");
    preventAwait(AlterTableColumnAlteringBuilder, "don't await AlterTableColumnAlteringBuilder instances directly. To execute the query you need to call `execute`");
  }
});

// node_modules/kysely/dist/esm/plugin/immediate-value/immediate-value-transformer.js
var ImmediateValueTransformer;
var init_immediate_value_transformer = __esm({
  "node_modules/kysely/dist/esm/plugin/immediate-value/immediate-value-transformer.js"() {
    init_operation_node_transformer();
    ImmediateValueTransformer = class extends OperationNodeTransformer {
      transformValue(node) {
        return {
          ...super.transformValue(node),
          immediate: true
        };
      }
    };
  }
});

// node_modules/kysely/dist/esm/schema/create-index-builder.js
var CreateIndexBuilder;
var init_create_index_builder = __esm({
  "node_modules/kysely/dist/esm/schema/create-index-builder.js"() {
    init_create_index_node();
    init_raw_node();
    init_reference_parser();
    init_table_parser();
    init_prevent_await();
    init_object_utils();
    init_binary_operation_parser();
    init_query_node();
    init_immediate_value_transformer();
    CreateIndexBuilder = class _CreateIndexBuilder {
      #props;
      constructor(props) {
        this.#props = freeze(props);
      }
      /**
       * Adds the "if not exists" modifier.
       *
       * If the index already exists, no error is thrown if this method has been called.
       */
      ifNotExists() {
        return new _CreateIndexBuilder({
          ...this.#props,
          node: CreateIndexNode.cloneWith(this.#props.node, {
            ifNotExists: true
          })
        });
      }
      /**
       * Makes the index unique.
       */
      unique() {
        return new _CreateIndexBuilder({
          ...this.#props,
          node: CreateIndexNode.cloneWith(this.#props.node, {
            unique: true
          })
        });
      }
      /**
       * Specifies the table for the index.
       */
      on(table) {
        return new _CreateIndexBuilder({
          ...this.#props,
          node: CreateIndexNode.cloneWith(this.#props.node, {
            table: parseTable(table)
          })
        });
      }
      /**
       * Adds a column to the index.
       *
       * Also see {@link columns} for adding multiple columns at once or {@link expression}
       * for specifying an arbitrary expression.
       *
       * ### Examples
       *
       * ```ts
       * await db.schema
       *         .createIndex('person_first_name_and_age_index')
       *         .on('person')
       *         .column('first_name')
       *         .column('age desc')
       *         .execute()
       * ```
       *
       * The generated SQL (PostgreSQL):
       *
       * ```sql
       * create index "person_first_name_and_age_index" on "person" ("first_name", "age" desc)
       * ```
       */
      column(column) {
        return new _CreateIndexBuilder({
          ...this.#props,
          node: CreateIndexNode.cloneWithColumns(this.#props.node, [
            parseOrderedColumnName(column)
          ])
        });
      }
      /**
       * Specifies a list of columns for the index.
       *
       * Also see {@link column} for adding a single column or {@link expression} for
       * specifying an arbitrary expression.
       *
       * ### Examples
       *
       * ```ts
       * await db.schema
       *         .createIndex('person_first_name_and_age_index')
       *         .on('person')
       *         .columns(['first_name', 'age desc'])
       *         .execute()
       * ```
       *
       * The generated SQL (PostgreSQL):
       *
       * ```sql
       * create index "person_first_name_and_age_index" on "person" ("first_name", "age" desc)
       * ```
       */
      columns(columns) {
        return new _CreateIndexBuilder({
          ...this.#props,
          node: CreateIndexNode.cloneWithColumns(this.#props.node, columns.map(parseOrderedColumnName))
        });
      }
      /**
       * Specifies an arbitrary expression for the index.
       *
       * ### Examples
       *
       * ```ts
       * import { sql } from 'kysely'
       *
       * await db.schema
       *   .createIndex('person_first_name_index')
       *   .on('person')
       *   .expression(sql`first_name COLLATE "fi_FI"`)
       *   .execute()
       * ```
       *
       * The generated SQL (PostgreSQL):
       *
       * ```sql
       * create index "person_first_name_index" on "person" (first_name COLLATE "fi_FI")
       * ```
       */
      expression(expression) {
        return new _CreateIndexBuilder({
          ...this.#props,
          node: CreateIndexNode.cloneWithColumns(this.#props.node, [
            expression.toOperationNode()
          ])
        });
      }
      using(indexType) {
        return new _CreateIndexBuilder({
          ...this.#props,
          node: CreateIndexNode.cloneWith(this.#props.node, {
            using: RawNode.createWithSql(indexType)
          })
        });
      }
      where(...args) {
        const transformer = new ImmediateValueTransformer();
        return new _CreateIndexBuilder({
          ...this.#props,
          node: QueryNode.cloneWithWhere(this.#props.node, transformer.transformNode(parseValueBinaryOperationOrExpression(args)))
        });
      }
      /**
       * Simply calls the provided function passing `this` as the only argument. `$call` returns
       * what the provided function returns.
       */
      $call(func) {
        return func(this);
      }
      toOperationNode() {
        return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
      }
      compile() {
        return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
      }
      async execute() {
        await this.#props.executor.executeQuery(this.compile(), this.#props.queryId);
      }
    };
    preventAwait(CreateIndexBuilder, "don't await CreateIndexBuilder instances directly. To execute the query you need to call `execute`");
  }
});

// node_modules/kysely/dist/esm/schema/create-schema-builder.js
var CreateSchemaBuilder;
var init_create_schema_builder = __esm({
  "node_modules/kysely/dist/esm/schema/create-schema-builder.js"() {
    init_create_schema_node();
    init_prevent_await();
    init_object_utils();
    CreateSchemaBuilder = class _CreateSchemaBuilder {
      #props;
      constructor(props) {
        this.#props = freeze(props);
      }
      ifNotExists() {
        return new _CreateSchemaBuilder({
          ...this.#props,
          node: CreateSchemaNode.cloneWith(this.#props.node, { ifNotExists: true })
        });
      }
      /**
       * Simply calls the provided function passing `this` as the only argument. `$call` returns
       * what the provided function returns.
       */
      $call(func) {
        return func(this);
      }
      toOperationNode() {
        return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
      }
      compile() {
        return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
      }
      async execute() {
        await this.#props.executor.executeQuery(this.compile(), this.#props.queryId);
      }
    };
    preventAwait(CreateSchemaBuilder, "don't await CreateSchemaBuilder instances directly. To execute the query you need to call `execute`");
  }
});

// node_modules/kysely/dist/esm/parser/on-commit-action-parse.js
function parseOnCommitAction(action) {
  if (ON_COMMIT_ACTIONS.includes(action)) {
    return action;
  }
  throw new Error(`invalid OnCommitAction ${action}`);
}
var init_on_commit_action_parse = __esm({
  "node_modules/kysely/dist/esm/parser/on-commit-action-parse.js"() {
    init_create_table_node();
  }
});

// node_modules/kysely/dist/esm/schema/create-table-builder.js
var CreateTableBuilder;
var init_create_table_builder = __esm({
  "node_modules/kysely/dist/esm/schema/create-table-builder.js"() {
    init_column_definition_node();
    init_create_table_node();
    init_prevent_await();
    init_column_definition_builder();
    init_object_utils();
    init_foreign_key_constraint_node();
    init_column_node();
    init_foreign_key_constraint_builder();
    init_data_type_parser();
    init_primary_constraint_node();
    init_unique_constraint_node();
    init_check_constraint_node();
    init_table_parser();
    init_on_commit_action_parse();
    CreateTableBuilder = class _CreateTableBuilder {
      #props;
      constructor(props) {
        this.#props = freeze(props);
      }
      /**
       * Adds the "temporary" modifier.
       *
       * Use this to create a temporary table.
       */
      temporary() {
        return new _CreateTableBuilder({
          ...this.#props,
          node: CreateTableNode.cloneWith(this.#props.node, {
            temporary: true
          })
        });
      }
      /**
       * Adds an "on commit" statement.
       *
       * This can be used in conjunction with temporary tables on supported databases
       * like PostgreSQL.
       */
      onCommit(onCommit) {
        return new _CreateTableBuilder({
          ...this.#props,
          node: CreateTableNode.cloneWith(this.#props.node, {
            onCommit: parseOnCommitAction(onCommit)
          })
        });
      }
      /**
       * Adds the "if not exists" modifier.
       *
       * If the table already exists, no error is thrown if this method has been called.
       */
      ifNotExists() {
        return new _CreateTableBuilder({
          ...this.#props,
          node: CreateTableNode.cloneWith(this.#props.node, {
            ifNotExists: true
          })
        });
      }
      /**
       * Adds a column to the table.
       *
       * ### Examples
       *
       * ```ts
       * import { sql } from 'kysely'
       *
       * await db.schema
       *   .createTable('person')
       *   .addColumn('id', 'integer', (col) => col.autoIncrement().primaryKey()),
       *   .addColumn('first_name', 'varchar(50)', (col) => col.notNull())
       *   .addColumn('last_name', 'varchar(255)')
       *   .addColumn('bank_balance', 'numeric(8, 2)')
       *   // You can specify any data type using the `sql` tag if the types
       *   // don't include it.
       *   .addColumn('data', sql`any_type_here`)
       *   .addColumn('parent_id', 'integer', (col) =>
       *     col.references('person.id').onDelete('cascade'))
       *   )
       * ```
       *
       * With this method, it's once again good to remember that Kysely just builds the
       * query and doesn't provide the same API for all databses. For example, some
       * databases like older MySQL don't support the `references` statement in the
       * column definition. Instead foreign key constraints need to be defined in the
       * `create table` query. See the next example:
       *
       * ```ts
       *   .addColumn('parent_id', 'integer')
       *   .addForeignKeyConstraint(
       *     'person_parent_id_fk', ['parent_id'], 'person', ['id'],
       *     (cb) => cb.onDelete('cascade')
       *   )
       * ```
       *
       * Another good example is that PostgreSQL doesn't support the `auto_increment`
       * keyword and you need to define an autoincrementing column for example using
       * `serial`:
       *
       * ```ts
       * await db.schema
       *   .createTable('person')
       *   .addColumn('id', 'serial', (col) => col.primaryKey()),
       * ```
       */
      addColumn(columnName, dataType, build = noop) {
        const columnBuilder = build(new ColumnDefinitionBuilder(ColumnDefinitionNode.create(columnName, parseDataTypeExpression(dataType))));
        return new _CreateTableBuilder({
          ...this.#props,
          node: CreateTableNode.cloneWithColumn(this.#props.node, columnBuilder.toOperationNode())
        });
      }
      /**
       * Adds a primary key constraint for one or more columns.
       *
       * The constraint name can be anything you want, but it must be unique
       * across the whole database.
       *
       * ### Examples
       *
       * ```ts
       * addPrimaryKeyConstraint('primary_key', ['first_name', 'last_name'])
       * ```
       */
      addPrimaryKeyConstraint(constraintName, columns) {
        return new _CreateTableBuilder({
          ...this.#props,
          node: CreateTableNode.cloneWithConstraint(this.#props.node, PrimaryConstraintNode.create(columns, constraintName))
        });
      }
      /**
       * Adds a unique constraint for one or more columns.
       *
       * The constraint name can be anything you want, but it must be unique
       * across the whole database.
       *
       * ### Examples
       *
       * ```ts
       * addUniqueConstraint('first_name_last_name_unique', ['first_name', 'last_name'])
       * ```
       */
      addUniqueConstraint(constraintName, columns) {
        return new _CreateTableBuilder({
          ...this.#props,
          node: CreateTableNode.cloneWithConstraint(this.#props.node, UniqueConstraintNode.create(columns, constraintName))
        });
      }
      /**
       * Adds a check constraint.
       *
       * The constraint name can be anything you want, but it must be unique
       * across the whole database.
       *
       * ### Examples
       *
       * ```ts
       * import { sql } from 'kysely'
       *
       * addCheckConstraint('check_legs', sql`number_of_legs < 5`)
       * ```
       */
      addCheckConstraint(constraintName, checkExpression) {
        return new _CreateTableBuilder({
          ...this.#props,
          node: CreateTableNode.cloneWithConstraint(this.#props.node, CheckConstraintNode.create(checkExpression.toOperationNode(), constraintName))
        });
      }
      /**
       * Adds a foreign key constraint.
       *
       * The constraint name can be anything you want, but it must be unique
       * across the whole database.
       *
       * ### Examples
       *
       * ```ts
       * addForeignKeyConstraint(
       *   'owner_id_foreign',
       *   ['owner_id'],
       *   'person',
       *   ['id'],
       * )
       * ```
       *
       * Add constraint for multiple columns:
       *
       * ```ts
       * addForeignKeyConstraint(
       *   'owner_id_foreign',
       *   ['owner_id1', 'owner_id2'],
       *   'person',
       *   ['id1', 'id2'],
       *   (cb) => cb.onDelete('cascade')
       * )
       * ```
       */
      addForeignKeyConstraint(constraintName, columns, targetTable, targetColumns, build = noop) {
        const builder = build(new ForeignKeyConstraintBuilder(ForeignKeyConstraintNode.create(columns.map(ColumnNode.create), parseTable(targetTable), targetColumns.map(ColumnNode.create), constraintName)));
        return new _CreateTableBuilder({
          ...this.#props,
          node: CreateTableNode.cloneWithConstraint(this.#props.node, builder.toOperationNode())
        });
      }
      /**
       * This can be used to add any additional SQL to the front of the query __after__ the `create` keyword.
       *
       * Also see {@link temporary}.
       *
       * ### Examples
       *
       * ```ts
       * db.schema.createTable('person')
       *   .modifyFront(sql`global temporary`)
       *   .addColumn('id', 'integer', col => col.primaryKey())
       *   .addColumn('first_name', 'varchar(64)', col => col.notNull())
       *   .addColumn('last_name', 'varchar(64), col => col.notNull())
       *   .execute()
       * ```
       *
       * The generated SQL (Postgres):
       *
       * ```sql
       * create global temporary table "person" (
       *   "id" integer primary key,
       *   "first_name" varchar(64) not null,
       *   "last_name" varchar(64) not null
       * )
       * ```
       */
      modifyFront(modifier) {
        return new _CreateTableBuilder({
          ...this.#props,
          node: CreateTableNode.cloneWithFrontModifier(this.#props.node, modifier.toOperationNode())
        });
      }
      /**
       * This can be used to add any additional SQL to the end of the query.
       *
       * Also see {@link onCommit}.
       *
       * ### Examples
       *
       * ```ts
       * db.schema.createTable('person')
       *   .addColumn('id', 'integer', col => col => primaryKey())
       *   .addColumn('first_name', 'varchar(64)', col => col.notNull())
       *   .addColumn('last_name', 'varchar(64), col => col.notNull())
       *   .modifyEnd(sql`collate utf8_unicode_ci`)
       *   .execute()
       * ```
       *
       * The generated SQL (MySQL):
       *
       * ```sql
       * create table `person` (
       *   `id` integer primary key,
       *   `first_name` varchar(64) not null,
       *   `last_name` varchar(64) not null
       * ) collate utf8_unicode_ci
       * ```
       */
      modifyEnd(modifier) {
        return new _CreateTableBuilder({
          ...this.#props,
          node: CreateTableNode.cloneWithEndModifier(this.#props.node, modifier.toOperationNode())
        });
      }
      /**
       * Calls the given function passing `this` as the only argument.
       *
       * ### Examples
       *
       * ```ts
       * db.schema
       *   .createTable('test')
       *   .$call((builder) => builder.addColumn('id', 'integer'))
       *   .execute()
       * ```
       *
       * ```ts
       * const addDefaultColumns = <T extends string, C extends string = never>(
       *   builder: CreateTableBuilder<T, C>
       * ) => {
       *   return builder
       *     .addColumn('id', 'integer', (col) => col.notNull())
       *     .addColumn('created_at', 'date', (col) =>
       *       col.notNull().defaultTo(sql`now()`)
       *     )
       *     .addColumn('updated_at', 'date', (col) =>
       *       col.notNull().defaultTo(sql`now()`)
       *     )
       * }
       *
       * db.schema
       *   .createTable('test')
       *   .$call(addDefaultColumns)
       *   .execute()
       * ```
       */
      $call(func) {
        return func(this);
      }
      toOperationNode() {
        return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
      }
      compile() {
        return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
      }
      async execute() {
        await this.#props.executor.executeQuery(this.compile(), this.#props.queryId);
      }
    };
    preventAwait(CreateTableBuilder, "don't await CreateTableBuilder instances directly. To execute the query you need to call `execute`");
  }
});

// node_modules/kysely/dist/esm/schema/drop-index-builder.js
var DropIndexBuilder;
var init_drop_index_builder = __esm({
  "node_modules/kysely/dist/esm/schema/drop-index-builder.js"() {
    init_drop_index_node();
    init_prevent_await();
    init_table_parser();
    init_object_utils();
    DropIndexBuilder = class _DropIndexBuilder {
      #props;
      constructor(props) {
        this.#props = freeze(props);
      }
      /**
       * Specifies the table the index was created for. This is not needed
       * in all dialects.
       */
      on(table) {
        return new _DropIndexBuilder({
          ...this.#props,
          node: DropIndexNode.cloneWith(this.#props.node, {
            table: parseTable(table)
          })
        });
      }
      ifExists() {
        return new _DropIndexBuilder({
          ...this.#props,
          node: DropIndexNode.cloneWith(this.#props.node, {
            ifExists: true
          })
        });
      }
      cascade() {
        return new _DropIndexBuilder({
          ...this.#props,
          node: DropIndexNode.cloneWith(this.#props.node, {
            cascade: true
          })
        });
      }
      /**
       * Simply calls the provided function passing `this` as the only argument. `$call` returns
       * what the provided function returns.
       */
      $call(func) {
        return func(this);
      }
      toOperationNode() {
        return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
      }
      compile() {
        return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
      }
      async execute() {
        await this.#props.executor.executeQuery(this.compile(), this.#props.queryId);
      }
    };
    preventAwait(DropIndexBuilder, "don't await DropIndexBuilder instances directly. To execute the query you need to call `execute`");
  }
});

// node_modules/kysely/dist/esm/schema/drop-schema-builder.js
var DropSchemaBuilder;
var init_drop_schema_builder = __esm({
  "node_modules/kysely/dist/esm/schema/drop-schema-builder.js"() {
    init_drop_schema_node();
    init_prevent_await();
    init_object_utils();
    DropSchemaBuilder = class _DropSchemaBuilder {
      #props;
      constructor(props) {
        this.#props = freeze(props);
      }
      ifExists() {
        return new _DropSchemaBuilder({
          ...this.#props,
          node: DropSchemaNode.cloneWith(this.#props.node, {
            ifExists: true
          })
        });
      }
      cascade() {
        return new _DropSchemaBuilder({
          ...this.#props,
          node: DropSchemaNode.cloneWith(this.#props.node, {
            cascade: true
          })
        });
      }
      /**
       * Simply calls the provided function passing `this` as the only argument. `$call` returns
       * what the provided function returns.
       */
      $call(func) {
        return func(this);
      }
      toOperationNode() {
        return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
      }
      compile() {
        return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
      }
      async execute() {
        await this.#props.executor.executeQuery(this.compile(), this.#props.queryId);
      }
    };
    preventAwait(DropSchemaBuilder, "don't await DropSchemaBuilder instances directly. To execute the query you need to call `execute`");
  }
});

// node_modules/kysely/dist/esm/schema/drop-table-builder.js
var DropTableBuilder;
var init_drop_table_builder = __esm({
  "node_modules/kysely/dist/esm/schema/drop-table-builder.js"() {
    init_drop_table_node();
    init_prevent_await();
    init_object_utils();
    DropTableBuilder = class _DropTableBuilder {
      #props;
      constructor(props) {
        this.#props = freeze(props);
      }
      ifExists() {
        return new _DropTableBuilder({
          ...this.#props,
          node: DropTableNode.cloneWith(this.#props.node, {
            ifExists: true
          })
        });
      }
      cascade() {
        return new _DropTableBuilder({
          ...this.#props,
          node: DropTableNode.cloneWith(this.#props.node, {
            cascade: true
          })
        });
      }
      /**
       * Simply calls the provided function passing `this` as the only argument. `$call` returns
       * what the provided function returns.
       */
      $call(func) {
        return func(this);
      }
      toOperationNode() {
        return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
      }
      compile() {
        return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
      }
      async execute() {
        await this.#props.executor.executeQuery(this.compile(), this.#props.queryId);
      }
    };
    preventAwait(DropTableBuilder, "don't await DropTableBuilder instances directly. To execute the query you need to call `execute`");
  }
});

// node_modules/kysely/dist/esm/operation-node/create-view-node.js
var CreateViewNode;
var init_create_view_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/create-view-node.js"() {
    init_object_utils();
    init_schemable_identifier_node();
    CreateViewNode = freeze({
      is(node) {
        return node.kind === "CreateViewNode";
      },
      create(name) {
        return freeze({
          kind: "CreateViewNode",
          name: SchemableIdentifierNode.create(name)
        });
      },
      cloneWith(createView, params) {
        return freeze({
          ...createView,
          ...params
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/plugin/immediate-value/immediate-value-plugin.js
var ImmediateValuePlugin;
var init_immediate_value_plugin = __esm({
  "node_modules/kysely/dist/esm/plugin/immediate-value/immediate-value-plugin.js"() {
    init_immediate_value_transformer();
    ImmediateValuePlugin = class {
      #transformer = new ImmediateValueTransformer();
      transformQuery(args) {
        return this.#transformer.transformNode(args.node);
      }
      transformResult(args) {
        return Promise.resolve(args.result);
      }
    };
  }
});

// node_modules/kysely/dist/esm/schema/create-view-builder.js
var CreateViewBuilder;
var init_create_view_builder = __esm({
  "node_modules/kysely/dist/esm/schema/create-view-builder.js"() {
    init_prevent_await();
    init_object_utils();
    init_create_view_node();
    init_reference_parser();
    init_immediate_value_plugin();
    CreateViewBuilder = class _CreateViewBuilder {
      #props;
      constructor(props) {
        this.#props = freeze(props);
      }
      /**
       * Adds the "temporary" modifier.
       *
       * Use this to create a temporary view.
       */
      temporary() {
        return new _CreateViewBuilder({
          ...this.#props,
          node: CreateViewNode.cloneWith(this.#props.node, {
            temporary: true
          })
        });
      }
      materialized() {
        return new _CreateViewBuilder({
          ...this.#props,
          node: CreateViewNode.cloneWith(this.#props.node, {
            materialized: true
          })
        });
      }
      /**
       * Only implemented on some dialects like SQLite. On most dialects, use {@link orReplace}.
       */
      ifNotExists() {
        return new _CreateViewBuilder({
          ...this.#props,
          node: CreateViewNode.cloneWith(this.#props.node, {
            ifNotExists: true
          })
        });
      }
      orReplace() {
        return new _CreateViewBuilder({
          ...this.#props,
          node: CreateViewNode.cloneWith(this.#props.node, {
            orReplace: true
          })
        });
      }
      columns(columns) {
        return new _CreateViewBuilder({
          ...this.#props,
          node: CreateViewNode.cloneWith(this.#props.node, {
            columns: columns.map(parseColumnName)
          })
        });
      }
      /**
       * Sets the select query or a `values` statement that creates the view.
       *
       * WARNING!
       * Some dialects don't support parameterized queries in DDL statements and therefore
       * the query or raw {@link sql } expression passed here is interpolated into a single
       * string opening an SQL injection vulnerability. DO NOT pass unchecked user input
       * into the query or raw expression passed to this method!
       */
      as(query) {
        const queryNode = query.withPlugin(new ImmediateValuePlugin()).toOperationNode();
        return new _CreateViewBuilder({
          ...this.#props,
          node: CreateViewNode.cloneWith(this.#props.node, {
            as: queryNode
          })
        });
      }
      /**
       * Simply calls the provided function passing `this` as the only argument. `$call` returns
       * what the provided function returns.
       */
      $call(func) {
        return func(this);
      }
      toOperationNode() {
        return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
      }
      compile() {
        return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
      }
      async execute() {
        await this.#props.executor.executeQuery(this.compile(), this.#props.queryId);
      }
    };
    preventAwait(CreateViewBuilder, "don't await CreateViewBuilder instances directly. To execute the query you need to call `execute`");
  }
});

// node_modules/kysely/dist/esm/operation-node/drop-view-node.js
var DropViewNode;
var init_drop_view_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/drop-view-node.js"() {
    init_object_utils();
    init_schemable_identifier_node();
    DropViewNode = freeze({
      is(node) {
        return node.kind === "DropViewNode";
      },
      create(name) {
        return freeze({
          kind: "DropViewNode",
          name: SchemableIdentifierNode.create(name)
        });
      },
      cloneWith(dropView, params) {
        return freeze({
          ...dropView,
          ...params
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/schema/drop-view-builder.js
var DropViewBuilder;
var init_drop_view_builder = __esm({
  "node_modules/kysely/dist/esm/schema/drop-view-builder.js"() {
    init_prevent_await();
    init_object_utils();
    init_drop_view_node();
    DropViewBuilder = class _DropViewBuilder {
      #props;
      constructor(props) {
        this.#props = freeze(props);
      }
      materialized() {
        return new _DropViewBuilder({
          ...this.#props,
          node: DropViewNode.cloneWith(this.#props.node, {
            materialized: true
          })
        });
      }
      ifExists() {
        return new _DropViewBuilder({
          ...this.#props,
          node: DropViewNode.cloneWith(this.#props.node, {
            ifExists: true
          })
        });
      }
      cascade() {
        return new _DropViewBuilder({
          ...this.#props,
          node: DropViewNode.cloneWith(this.#props.node, {
            cascade: true
          })
        });
      }
      /**
       * Simply calls the provided function passing `this` as the only argument. `$call` returns
       * what the provided function returns.
       */
      $call(func) {
        return func(this);
      }
      toOperationNode() {
        return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
      }
      compile() {
        return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
      }
      async execute() {
        await this.#props.executor.executeQuery(this.compile(), this.#props.queryId);
      }
    };
    preventAwait(DropViewBuilder, "don't await DropViewBuilder instances directly. To execute the query you need to call `execute`");
  }
});

// node_modules/kysely/dist/esm/operation-node/create-type-node.js
var CreateTypeNode;
var init_create_type_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/create-type-node.js"() {
    init_object_utils();
    init_value_list_node();
    init_value_node();
    CreateTypeNode = freeze({
      is(node) {
        return node.kind === "CreateTypeNode";
      },
      create(name) {
        return freeze({
          kind: "CreateTypeNode",
          name
        });
      },
      cloneWithEnum(createType, values) {
        return freeze({
          ...createType,
          enum: ValueListNode.create(values.map((value) => ValueNode.createImmediate(value)))
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/schema/create-type-builder.js
var CreateTypeBuilder;
var init_create_type_builder = __esm({
  "node_modules/kysely/dist/esm/schema/create-type-builder.js"() {
    init_prevent_await();
    init_object_utils();
    init_create_type_node();
    CreateTypeBuilder = class _CreateTypeBuilder {
      #props;
      constructor(props) {
        this.#props = freeze(props);
      }
      toOperationNode() {
        return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
      }
      /**
       * Creates an anum type.
       *
       * ### Examples
       *
       * ```ts
       * db.schema.createType('species').asEnum(['cat', 'dog', 'frog'])
       * ```
       */
      asEnum(values) {
        return new _CreateTypeBuilder({
          ...this.#props,
          node: CreateTypeNode.cloneWithEnum(this.#props.node, values)
        });
      }
      /**
       * Simply calls the provided function passing `this` as the only argument. `$call` returns
       * what the provided function returns.
       */
      $call(func) {
        return func(this);
      }
      compile() {
        return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
      }
      async execute() {
        await this.#props.executor.executeQuery(this.compile(), this.#props.queryId);
      }
    };
    preventAwait(CreateTypeBuilder, "don't await CreateTypeBuilder instances directly. To execute the query you need to call `execute`");
  }
});

// node_modules/kysely/dist/esm/operation-node/drop-type-node.js
var DropTypeNode;
var init_drop_type_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/drop-type-node.js"() {
    init_object_utils();
    DropTypeNode = freeze({
      is(node) {
        return node.kind === "DropTypeNode";
      },
      create(name) {
        return freeze({
          kind: "DropTypeNode",
          name
        });
      },
      cloneWith(dropType, params) {
        return freeze({
          ...dropType,
          ...params
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/schema/drop-type-builder.js
var DropTypeBuilder;
var init_drop_type_builder = __esm({
  "node_modules/kysely/dist/esm/schema/drop-type-builder.js"() {
    init_drop_type_node();
    init_prevent_await();
    init_object_utils();
    DropTypeBuilder = class _DropTypeBuilder {
      #props;
      constructor(props) {
        this.#props = freeze(props);
      }
      ifExists() {
        return new _DropTypeBuilder({
          ...this.#props,
          node: DropTypeNode.cloneWith(this.#props.node, {
            ifExists: true
          })
        });
      }
      /**
       * Simply calls the provided function passing `this` as the only argument. `$call` returns
       * what the provided function returns.
       */
      $call(func) {
        return func(this);
      }
      toOperationNode() {
        return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
      }
      compile() {
        return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
      }
      async execute() {
        await this.#props.executor.executeQuery(this.compile(), this.#props.queryId);
      }
    };
    preventAwait(DropTypeBuilder, "don't await DropTypeBuilder instances directly. To execute the query you need to call `execute`");
  }
});

// node_modules/kysely/dist/esm/parser/identifier-parser.js
function parseSchemableIdentifier(id) {
  const SCHEMA_SEPARATOR = ".";
  if (id.includes(SCHEMA_SEPARATOR)) {
    const parts = id.split(SCHEMA_SEPARATOR).map(trim3);
    if (parts.length === 2) {
      return SchemableIdentifierNode.createWithSchema(parts[0], parts[1]);
    } else {
      throw new Error(`invalid schemable identifier ${id}`);
    }
  } else {
    return SchemableIdentifierNode.create(id);
  }
}
function trim3(str) {
  return str.trim();
}
var init_identifier_parser = __esm({
  "node_modules/kysely/dist/esm/parser/identifier-parser.js"() {
    init_schemable_identifier_node();
  }
});

// node_modules/kysely/dist/esm/schema/schema.js
var SchemaModule;
var init_schema = __esm({
  "node_modules/kysely/dist/esm/schema/schema.js"() {
    init_alter_table_node();
    init_create_index_node();
    init_create_schema_node();
    init_create_table_node();
    init_drop_index_node();
    init_drop_schema_node();
    init_drop_table_node();
    init_table_parser();
    init_alter_table_builder();
    init_create_index_builder();
    init_create_schema_builder();
    init_create_table_builder();
    init_drop_index_builder();
    init_drop_schema_builder();
    init_drop_table_builder();
    init_query_id();
    init_with_schema_plugin();
    init_create_view_builder();
    init_create_view_node();
    init_drop_view_builder();
    init_drop_view_node();
    init_create_type_builder();
    init_drop_type_builder();
    init_create_type_node();
    init_drop_type_node();
    init_identifier_parser();
    SchemaModule = class _SchemaModule {
      #executor;
      constructor(executor) {
        this.#executor = executor;
      }
      /**
       * Create a new table.
       *
       * ### Examples
       *
       * This example creates a new table with columns `id`, `first_name`,
       * `last_name` and `gender`:
       *
       * ```ts
       * await db.schema
       *   .createTable('person')
       *   .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
       *   .addColumn('first_name', 'varchar', col => col.notNull())
       *   .addColumn('last_name', 'varchar', col => col.notNull())
       *   .addColumn('gender', 'varchar')
       *   .execute()
       * ```
       *
       * This example creates a table with a foreign key. Not all database
       * engines support column-level foreign key constraint definitions.
       * For example if you are using MySQL 5.X see the next example after
       * this one.
       *
       * ```ts
       * await db.schema
       *   .createTable('pet')
       *   .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
       *   .addColumn('owner_id', 'integer', col => col
       *     .references('person.id')
       *     .onDelete('cascade')
       *   )
       *   .execute()
       * ```
       *
       * This example adds a foreign key constraint for a columns just
       * like the previous example, but using a table-level statement.
       * On MySQL 5.X you need to define foreign key constraints like
       * this:
       *
       * ```ts
       * await db.schema
       *   .createTable('pet')
       *   .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
       *   .addColumn('owner_id', 'integer')
       *   .addForeignKeyConstraint(
       *     'pet_owner_id_foreign', ['owner_id'], 'person', ['id'],
       *     (constraint) => constraint.onDelete('cascade')
       *   )
       *   .execute()
       * ```
       */
      createTable(table) {
        return new CreateTableBuilder({
          queryId: createQueryId(),
          executor: this.#executor,
          node: CreateTableNode.create(parseTable(table))
        });
      }
      /**
       * Drop a table.
       *
       * ### Examples
       *
       * ```ts
       * await db.schema
       *   .dropTable('person')
       *   .execute()
       * ```
       */
      dropTable(table) {
        return new DropTableBuilder({
          queryId: createQueryId(),
          executor: this.#executor,
          node: DropTableNode.create(parseTable(table))
        });
      }
      /**
       * Create a new index.
       *
       * ### Examples
       *
       * ```ts
       * await db.schema
       *   .createIndex('person_full_name_unique_index')
       *   .on('person')
       *   .columns(['first_name', 'last_name'])
       *   .execute()
       * ```
       */
      createIndex(indexName) {
        return new CreateIndexBuilder({
          queryId: createQueryId(),
          executor: this.#executor,
          node: CreateIndexNode.create(indexName)
        });
      }
      /**
       * Drop an index.
       *
       * ### Examples
       *
       * ```ts
       * await db.schema
       *   .dropIndex('person_full_name_unique_index')
       *   .execute()
       * ```
       */
      dropIndex(indexName) {
        return new DropIndexBuilder({
          queryId: createQueryId(),
          executor: this.#executor,
          node: DropIndexNode.create(indexName)
        });
      }
      /**
       * Create a new schema.
       *
       * ### Examples
       *
       * ```ts
       * await db.schema
       *   .createSchema('some_schema')
       *   .execute()
       * ```
       */
      createSchema(schema9) {
        return new CreateSchemaBuilder({
          queryId: createQueryId(),
          executor: this.#executor,
          node: CreateSchemaNode.create(schema9)
        });
      }
      /**
       * Drop a schema.
       *
       * ### Examples
       *
       * ```ts
       * await db.schema
       *   .dropSchema('some_schema')
       *   .execute()
       * ```
       */
      dropSchema(schema9) {
        return new DropSchemaBuilder({
          queryId: createQueryId(),
          executor: this.#executor,
          node: DropSchemaNode.create(schema9)
        });
      }
      /**
       * Alter a table.
       *
       * ### Examples
       *
       * ```ts
       * await db.schema
       *   .alterTable('person')
       *   .alterColumn('first_name', (ac) => ac.setDataType('text'))
       *   .execute()
       * ```
       */
      alterTable(table) {
        return new AlterTableBuilder({
          queryId: createQueryId(),
          executor: this.#executor,
          node: AlterTableNode.create(parseTable(table))
        });
      }
      /**
       * Create a new view.
       *
       * ### Examples
       *
       * ```ts
       * await db.schema
       *   .createView('dogs')
       *   .orReplace()
       *   .as(db.selectFrom('pet').selectAll().where('species', '=', 'dog'))
       *   .execute()
       * ```
       */
      createView(viewName) {
        return new CreateViewBuilder({
          queryId: createQueryId(),
          executor: this.#executor,
          node: CreateViewNode.create(viewName)
        });
      }
      /**
       * Drop a view.
       *
       * ### Examples
       *
       * ```ts
       * await db.schema
       *   .dropView('dogs')
       *   .ifExists()
       *   .execute()
       * ```
       */
      dropView(viewName) {
        return new DropViewBuilder({
          queryId: createQueryId(),
          executor: this.#executor,
          node: DropViewNode.create(viewName)
        });
      }
      /**
       * Create a new type.
       *
       * Only some dialects like PostgreSQL have user-defined types.
       *
       * ### Examples
       *
       * ```ts
       * await db.schema
       *   .createType('species')
       *   .asEnum(['dog', 'cat', 'frog'])
       *   .execute()
       * ```
       */
      createType(typeName) {
        return new CreateTypeBuilder({
          queryId: createQueryId(),
          executor: this.#executor,
          node: CreateTypeNode.create(parseSchemableIdentifier(typeName))
        });
      }
      /**
       * Drop a type.
       *
       * Only some dialects like PostgreSQL have user-defined types.
       *
       * ### Examples
       *
       * ```ts
       * await db.schema
       *   .dropType('species')
       *   .ifExists()
       *   .execute()
       * ```
       */
      dropType(typeName) {
        return new DropTypeBuilder({
          queryId: createQueryId(),
          executor: this.#executor,
          node: DropTypeNode.create(parseSchemableIdentifier(typeName))
        });
      }
      /**
       * Returns a copy of this schema module with the given plugin installed.
       */
      withPlugin(plugin) {
        return new _SchemaModule(this.#executor.withPlugin(plugin));
      }
      /**
       * Returns a copy of this schema module  without any plugins.
       */
      withoutPlugins() {
        return new _SchemaModule(this.#executor.withoutPlugins());
      }
      /**
       * See {@link QueryCreator.withSchema}
       */
      withSchema(schema9) {
        return new _SchemaModule(this.#executor.withPluginAtFront(new WithSchemaPlugin(schema9)));
      }
    };
  }
});

// node_modules/kysely/dist/esm/dynamic/dynamic.js
var DynamicModule;
var init_dynamic = __esm({
  "node_modules/kysely/dist/esm/dynamic/dynamic.js"() {
    init_dynamic_reference_builder();
    DynamicModule = class {
      /**
       * Creates a dynamic reference to a column that is not know at compile time.
       *
       * Kysely is built in a way that by default you can't refer to tables or columns
       * that are not actually visible in the current query and context. This is all
       * done by typescript at compile time, which means that you need to know the
       * columns and tables at compile time. This is not always the case of course.
       *
       * This method is meant to be used in those cases where the column names
       * come from the user input or are not otherwise known at compile time.
       *
       * WARNING! Unlike values, column names are not escaped by the database engine
       * or Kysely and if you pass in unchecked column names using this method, you
       * create an SQL injection vulnerability. Always __always__ validate the user
       * input before passing it to this method.
       *
       * There are couple of examples below for some use cases, but you can pass
       * `ref` to other methods as well. If the types allow you to pass a `ref`
       * value to some place, it should work.
       *
       * ### Examples
       *
       * Filter by a column not know at compile time:
       *
       * ```ts
       * async function someQuery(filterColumn: string, filterValue: string) {
       *   const { ref } = db.dynamic
       *
       *   return await db
       *     .selectFrom('person')
       *     .selectAll()
       *     .where(ref(filterColumn), '=', filterValue)
       *     .execute()
       * }
       *
       * someQuery('first_name', 'Arnold')
       * someQuery('person.last_name', 'Aniston')
       * ```
       *
       * Order by a column not know at compile time:
       *
       * ```ts
       * async function someQuery(orderBy: string) {
       *   const { ref } = db.dynamic
       *
       *   return await db
       *     .selectFrom('person')
       *     .select('person.first_name as fn')
       *     .orderBy(ref(orderBy))
       *     .execute()
       * }
       *
       * someQuery('fn')
       * ```
       *
       * In this example we add selections dynamically:
       *
       * ```ts
       * const { ref } = db.dynamic
       *
       * // Some column name provided by the user. Value not known at compile time.
       * const columnFromUserInput = req.query.select;
       *
       * // A type that lists all possible values `columnFromUserInput` can have.
       * // You can use `keyof Person` if any column of an interface is allowed.
       * type PossibleColumns = 'last_name' | 'first_name' | 'birth_date'
       *
       * const [person] = await db.selectFrom('person')
       *   .select([
       *     ref<PossibleColumns>(columnFromUserInput),
       *     'id'
       *   ])
       *   .execute()
       *
       * // The resulting type contains all `PossibleColumns` as optional fields
       * // because we cannot know which field was actually selected before
       * // running the code.
       * const lastName: string | undefined = person.last_name
       * const firstName: string | undefined = person.first_name
       * const birthDate: string | undefined = person.birth_date
       *
       * // The result type also contains the compile time selection `id`.
       * person.id
       * ```
       */
      ref(reference) {
        return new DynamicReferenceBuilder(reference);
      }
    };
  }
});

// node_modules/kysely/dist/esm/driver/default-connection-provider.js
var DefaultConnectionProvider;
var init_default_connection_provider = __esm({
  "node_modules/kysely/dist/esm/driver/default-connection-provider.js"() {
    DefaultConnectionProvider = class {
      #driver;
      constructor(driver) {
        this.#driver = driver;
      }
      async provideConnection(consumer) {
        const connection = await this.#driver.acquireConnection();
        try {
          return await consumer(connection);
        } finally {
          await this.#driver.releaseConnection(connection);
        }
      }
    };
  }
});

// node_modules/kysely/dist/esm/query-executor/default-query-executor.js
var DefaultQueryExecutor;
var init_default_query_executor = __esm({
  "node_modules/kysely/dist/esm/query-executor/default-query-executor.js"() {
    init_query_executor_base();
    DefaultQueryExecutor = class _DefaultQueryExecutor extends QueryExecutorBase {
      #compiler;
      #adapter;
      #connectionProvider;
      constructor(compiler, adapter, connectionProvider, plugins = []) {
        super(plugins);
        this.#compiler = compiler;
        this.#adapter = adapter;
        this.#connectionProvider = connectionProvider;
      }
      get adapter() {
        return this.#adapter;
      }
      compileQuery(node) {
        return this.#compiler.compileQuery(node);
      }
      provideConnection(consumer) {
        return this.#connectionProvider.provideConnection(consumer);
      }
      withPlugins(plugins) {
        return new _DefaultQueryExecutor(this.#compiler, this.#adapter, this.#connectionProvider, [...this.plugins, ...plugins]);
      }
      withPlugin(plugin) {
        return new _DefaultQueryExecutor(this.#compiler, this.#adapter, this.#connectionProvider, [...this.plugins, plugin]);
      }
      withPluginAtFront(plugin) {
        return new _DefaultQueryExecutor(this.#compiler, this.#adapter, this.#connectionProvider, [plugin, ...this.plugins]);
      }
      withConnectionProvider(connectionProvider) {
        return new _DefaultQueryExecutor(this.#compiler, this.#adapter, connectionProvider, [...this.plugins]);
      }
      withoutPlugins() {
        return new _DefaultQueryExecutor(this.#compiler, this.#adapter, this.#connectionProvider, []);
      }
    };
  }
});

// node_modules/kysely/dist/esm/util/performance-now.js
function performanceNow() {
  if (typeof performance !== "undefined" && isFunction(performance.now)) {
    return performance.now();
  } else {
    return Date.now();
  }
}
var init_performance_now = __esm({
  "node_modules/kysely/dist/esm/util/performance-now.js"() {
    init_object_utils();
  }
});

// node_modules/kysely/dist/esm/driver/runtime-driver.js
var RuntimeDriver;
var init_runtime_driver = __esm({
  "node_modules/kysely/dist/esm/driver/runtime-driver.js"() {
    init_performance_now();
    RuntimeDriver = class {
      #driver;
      #log;
      #initPromise;
      #initDone;
      #destroyPromise;
      #connections = /* @__PURE__ */ new WeakSet();
      constructor(driver, log) {
        this.#initDone = false;
        this.#driver = driver;
        this.#log = log;
      }
      async init() {
        if (this.#destroyPromise) {
          throw new Error("driver has already been destroyed");
        }
        if (!this.#initPromise) {
          this.#initPromise = this.#driver.init().then(() => {
            this.#initDone = true;
          }).catch((err) => {
            this.#initPromise = void 0;
            return Promise.reject(err);
          });
        }
        await this.#initPromise;
      }
      async acquireConnection() {
        if (this.#destroyPromise) {
          throw new Error("driver has already been destroyed");
        }
        if (!this.#initDone) {
          await this.init();
        }
        const connection = await this.#driver.acquireConnection();
        if (!this.#connections.has(connection)) {
          if (this.#needsLogging()) {
            this.#addLogging(connection);
          }
          this.#connections.add(connection);
        }
        return connection;
      }
      async releaseConnection(connection) {
        await this.#driver.releaseConnection(connection);
      }
      beginTransaction(connection, settings) {
        return this.#driver.beginTransaction(connection, settings);
      }
      commitTransaction(connection) {
        return this.#driver.commitTransaction(connection);
      }
      rollbackTransaction(connection) {
        return this.#driver.rollbackTransaction(connection);
      }
      async destroy() {
        if (!this.#initPromise) {
          return;
        }
        await this.#initPromise;
        if (!this.#destroyPromise) {
          this.#destroyPromise = this.#driver.destroy().catch((err) => {
            this.#destroyPromise = void 0;
            return Promise.reject(err);
          });
        }
        await this.#destroyPromise;
      }
      #needsLogging() {
        return this.#log.isLevelEnabled("query") || this.#log.isLevelEnabled("error");
      }
      // This method monkey patches the database connection's executeQuery method
      // by adding logging code around it. Monkey patching is not pretty, but it's
      // the best option in this case.
      #addLogging(connection) {
        const executeQuery = connection.executeQuery;
        connection.executeQuery = async (compiledQuery) => {
          const startTime = performanceNow();
          try {
            return await executeQuery.call(connection, compiledQuery);
          } catch (error) {
            await this.#logError(error, compiledQuery, startTime);
            throw error;
          } finally {
            await this.#logQuery(compiledQuery, startTime);
          }
        };
      }
      async #logError(error, compiledQuery, startTime) {
        await this.#log.error(() => ({
          level: "error",
          error,
          query: compiledQuery,
          queryDurationMillis: this.#calculateDurationMillis(startTime)
        }));
      }
      async #logQuery(compiledQuery, startTime) {
        await this.#log.query(() => ({
          level: "query",
          query: compiledQuery,
          queryDurationMillis: this.#calculateDurationMillis(startTime)
        }));
      }
      #calculateDurationMillis(startTime) {
        return performanceNow() - startTime;
      }
    };
  }
});

// node_modules/kysely/dist/esm/driver/single-connection-provider.js
var SingleConnectionProvider;
var init_single_connection_provider = __esm({
  "node_modules/kysely/dist/esm/driver/single-connection-provider.js"() {
    SingleConnectionProvider = class {
      #connection;
      #runningPromise;
      constructor(connection) {
        this.#connection = connection;
      }
      async provideConnection(consumer) {
        while (this.#runningPromise) {
          await this.#runningPromise;
        }
        const promise = this.#run(consumer);
        this.#runningPromise = promise.then(() => {
          this.#runningPromise = void 0;
        }).catch(() => {
          this.#runningPromise = void 0;
        });
        return promise;
      }
      // Run the runner in an async function to make sure it doesn't
      // throw synchronous errors.
      async #run(runner) {
        return await runner(this.#connection);
      }
    };
  }
});

// node_modules/kysely/dist/esm/driver/driver.js
var TRANSACTION_ISOLATION_LEVELS;
var init_driver = __esm({
  "node_modules/kysely/dist/esm/driver/driver.js"() {
    TRANSACTION_ISOLATION_LEVELS = [
      "read uncommitted",
      "read committed",
      "repeatable read",
      "serializable"
    ];
  }
});

// node_modules/kysely/dist/esm/util/log.js
function defaultLogger(event) {
  if (event.level === "query") {
    console.log(`kysely:query: ${event.query.sql}`);
    console.log(`kysely:query: duration: ${event.queryDurationMillis.toFixed(1)}ms`);
  } else if (event.level === "error") {
    if (event.error instanceof Error) {
      console.error(`kysely:error: ${event.error.stack ?? event.error.message}`);
    } else {
      console.error(`kysely:error: ${event}`);
    }
  }
}
var LOG_LEVELS, Log;
var init_log = __esm({
  "node_modules/kysely/dist/esm/util/log.js"() {
    init_object_utils();
    LOG_LEVELS = freeze(["query", "error"]);
    Log = class {
      #levels;
      #logger;
      constructor(config) {
        if (isFunction(config)) {
          this.#logger = config;
          this.#levels = freeze({
            query: true,
            error: true
          });
        } else {
          this.#logger = defaultLogger;
          this.#levels = freeze({
            query: config.includes("query"),
            error: config.includes("error")
          });
        }
      }
      isLevelEnabled(level) {
        return this.#levels[level];
      }
      async query(getEvent) {
        if (this.#levels.query) {
          await this.#logger(getEvent());
        }
      }
      async error(getEvent) {
        if (this.#levels.error) {
          await this.#logger(getEvent());
        }
      }
    };
  }
});

// node_modules/kysely/dist/esm/util/compilable.js
function isCompilable(value) {
  return isObject(value) && isFunction(value.compile);
}
var init_compilable = __esm({
  "node_modules/kysely/dist/esm/util/compilable.js"() {
    init_object_utils();
  }
});

// node_modules/kysely/dist/esm/kysely.js
function isKyselyProps(obj) {
  return isObject(obj) && isObject(obj.config) && isObject(obj.driver) && isObject(obj.executor) && isObject(obj.dialect);
}
function validateTransactionSettings(settings) {
  if (settings.isolationLevel && !TRANSACTION_ISOLATION_LEVELS.includes(settings.isolationLevel)) {
    throw new Error(`invalid transaction isolation level ${settings.isolationLevel}`);
  }
}
var Kysely, Transaction, ConnectionBuilder, TransactionBuilder;
var init_kysely = __esm({
  "node_modules/kysely/dist/esm/kysely.js"() {
    init_schema();
    init_dynamic();
    init_default_connection_provider();
    init_query_creator();
    init_default_query_executor();
    init_object_utils();
    init_runtime_driver();
    init_single_connection_provider();
    init_driver();
    init_prevent_await();
    init_function_module();
    init_log();
    init_query_id();
    init_compilable();
    init_case_builder();
    init_case_node();
    init_expression_parser();
    init_with_schema_plugin();
    Kysely = class _Kysely extends QueryCreator {
      #props;
      constructor(args) {
        let superProps;
        let props;
        if (isKyselyProps(args)) {
          superProps = { executor: args.executor };
          props = { ...args };
        } else {
          const dialect = args.dialect;
          const driver = dialect.createDriver();
          const compiler = dialect.createQueryCompiler();
          const adapter = dialect.createAdapter();
          const log = new Log(args.log ?? []);
          const runtimeDriver = new RuntimeDriver(driver, log);
          const connectionProvider = new DefaultConnectionProvider(runtimeDriver);
          const executor = new DefaultQueryExecutor(compiler, adapter, connectionProvider, args.plugins ?? []);
          superProps = { executor };
          props = {
            config: args,
            executor,
            dialect,
            driver: runtimeDriver
          };
        }
        super(superProps);
        this.#props = freeze(props);
      }
      /**
       * Returns the {@link SchemaModule} module for building database schema.
       */
      get schema() {
        return new SchemaModule(this.#props.executor);
      }
      /**
       * Returns a the {@link DynamicModule} module.
       *
       * The {@link DynamicModule} module can be used to bypass strict typing and
       * passing in dynamic values for the queries.
       */
      get dynamic() {
        return new DynamicModule();
      }
      /**
       * Returns a {@link DatabaseIntrospector | database introspector}.
       */
      get introspection() {
        return this.#props.dialect.createIntrospector(this.withoutPlugins());
      }
      case(value) {
        return new CaseBuilder({
          node: CaseNode.create(isUndefined3(value) ? void 0 : parseExpression(value))
        });
      }
      /**
       * Returns a {@link FunctionModule} that can be used to write type safe function
       * calls.
       *
       * ```ts
       * await db.selectFrom('person')
       *   .innerJoin('pet', 'pet.owner_id', 'person.id')
       *   .select((eb) => [
       *     'person.id',
       *     eb.fn.count('pet.id').as('pet_count')
       *   ])
       *   .groupBy('person.id')
       *   .having((eb) => eb.fn.count('pet.id'), '>', 10)
       *   .execute()
       * ```
       *
       * The generated SQL (PostgreSQL):
       *
       * ```sql
       * select "person"."id", count("pet"."id") as "pet_count"
       * from "person"
       * inner join "pet" on "pet"."owner_id" = "person"."id"
       * group by "person"."id"
       * having count("pet"."id") > $1
       * ```
       */
      get fn() {
        return createFunctionModule();
      }
      /**
       * Creates a {@link TransactionBuilder} that can be used to run queries inside a transaction.
       *
       * The returned {@link TransactionBuilder} can be used to configure the transaction. The
       * {@link TransactionBuilder.execute} method can then be called to run the transaction.
       * {@link TransactionBuilder.execute} takes a function that is run inside the
       * transaction. If the function throws, the transaction is rolled back. Otherwise
       * the transaction is committed.
       *
       * The callback function passed to the {@link TransactionBuilder.execute | execute}
       * method gets the transaction object as its only argument. The transaction is
       * of type {@link Transaction} which inherits {@link Kysely}. Any query
       * started through the transaction object is executed inside the transaction.
       *
       * ### Examples
       *
       * <!-- siteExample("transactions", "Simple transaction", 10) -->
       *
       * This example inserts two rows in a transaction. If an error is thrown inside
       * the callback passed to the `execute` method, the transaction is rolled back.
       * Otherwise it's committed.
       *
       * ```ts
       * const catto = await db.transaction().execute(async (trx) => {
       *   const jennifer = await trx.insertInto('person')
       *     .values({
       *       first_name: 'Jennifer',
       *       last_name: 'Aniston',
       *       age: 40,
       *     })
       *     .returning('id')
       *     .executeTakeFirstOrThrow()
       *
       *   return await trx.insertInto('pet')
       *     .values({
       *       owner_id: jennifer.id,
       *       name: 'Catto',
       *       species: 'cat',
       *       is_favorite: false,
       *     })
       *     .returningAll()
       *     .executeTakeFirst()
       * })
       * ```
       *
       * Setting the isolation level:
       *
       * ```ts
       * await db
       *   .transaction()
       *   .setIsolationLevel('serializable')
       *   .execute(async (trx) => {
       *     await doStuff(trx)
       *   })
       * ```
       */
      transaction() {
        return new TransactionBuilder({ ...this.#props });
      }
      /**
       * Provides a kysely instance bound to a single database connection.
       *
       * ### Examples
       *
       * ```ts
       * await db
       *   .connection()
       *   .execute(async (db) => {
       *     // `db` is an instance of `Kysely` that's bound to a single
       *     // database connection. All queries executed through `db` use
       *     // the same connection.
       *     await doStuff(db)
       *   })
       * ```
       */
      connection() {
        return new ConnectionBuilder({ ...this.#props });
      }
      /**
       * Returns a copy of this Kysely instance with the given plugin installed.
       */
      withPlugin(plugin) {
        return new _Kysely({
          ...this.#props,
          executor: this.#props.executor.withPlugin(plugin)
        });
      }
      /**
       * Returns a copy of this Kysely instance without any plugins.
       */
      withoutPlugins() {
        return new _Kysely({
          ...this.#props,
          executor: this.#props.executor.withoutPlugins()
        });
      }
      /**
       * @override
       */
      withSchema(schema9) {
        return new _Kysely({
          ...this.#props,
          executor: this.#props.executor.withPluginAtFront(new WithSchemaPlugin(schema9))
        });
      }
      /**
       * Returns a copy of this Kysely instance with tables added to its
       * database type.
       *
       * This method only modifies the types and doesn't affect any of the
       * executed queries in any way.
       *
       * ### Examples
       *
       * The following example adds and uses a temporary table:
       *
       * @example
       * ```ts
       * await db.schema
       *   .createTable('temp_table')
       *   .temporary()
       *   .addColumn('some_column', 'integer')
       *   .execute()
       *
       * const tempDb = db.withTables<{
       *   temp_table: {
       *     some_column: number
       *   }
       * }>()
       *
       * await tempDb
       *   .insertInto('temp_table')
       *   .values({ some_column: 100 })
       *   .execute()
       * ```
       */
      withTables() {
        return new _Kysely({ ...this.#props });
      }
      /**
       * Releases all resources and disconnects from the database.
       *
       * You need to call this when you are done using the `Kysely` instance.
       */
      async destroy() {
        await this.#props.driver.destroy();
      }
      /**
       * Returns true if this `Kysely` instance is a transaction.
       *
       * You can also use `db instanceof Transaction`.
       */
      get isTransaction() {
        return false;
      }
      /**
       * @internal
       * @private
       */
      getExecutor() {
        return this.#props.executor;
      }
      /**
       * Executes a given compiled query or query builder.
       *
       * See {@link https://github.com/koskimas/kysely/blob/master/site/docs/recipes/splitting-build-compile-and-execute-code.md#execute-compiled-queries splitting build, compile and execute code recipe} for more information.
       */
      executeQuery(query, queryId = createQueryId()) {
        const compiledQuery = isCompilable(query) ? query.compile() : query;
        return this.getExecutor().executeQuery(compiledQuery, queryId);
      }
    };
    Transaction = class _Transaction extends Kysely {
      #props;
      constructor(props) {
        super(props);
        this.#props = props;
      }
      // The return type is `true` instead of `boolean` to make Kysely<DB>
      // unassignable to Transaction<DB> while allowing assignment the
      // other way around.
      get isTransaction() {
        return true;
      }
      transaction() {
        throw new Error("calling the transaction method for a Transaction is not supported");
      }
      connection() {
        throw new Error("calling the connection method for a Transaction is not supported");
      }
      async destroy() {
        throw new Error("calling the destroy method for a Transaction is not supported");
      }
      withPlugin(plugin) {
        return new _Transaction({
          ...this.#props,
          executor: this.#props.executor.withPlugin(plugin)
        });
      }
      withoutPlugins() {
        return new _Transaction({
          ...this.#props,
          executor: this.#props.executor.withoutPlugins()
        });
      }
      /**
       * @override
       */
      withSchema(schema9) {
        return new _Transaction({
          ...this.#props,
          executor: this.#props.executor.withPluginAtFront(new WithSchemaPlugin(schema9))
        });
      }
      withTables() {
        return new _Transaction({ ...this.#props });
      }
    };
    ConnectionBuilder = class {
      #props;
      constructor(props) {
        this.#props = freeze(props);
      }
      async execute(callback) {
        return this.#props.executor.provideConnection(async (connection) => {
          const executor = this.#props.executor.withConnectionProvider(new SingleConnectionProvider(connection));
          const db2 = new Kysely({
            ...this.#props,
            executor
          });
          return await callback(db2);
        });
      }
    };
    preventAwait(ConnectionBuilder, "don't await ConnectionBuilder instances directly. To execute the query you need to call the `execute` method");
    TransactionBuilder = class _TransactionBuilder {
      #props;
      constructor(props) {
        this.#props = freeze(props);
      }
      setIsolationLevel(isolationLevel) {
        return new _TransactionBuilder({
          ...this.#props,
          isolationLevel
        });
      }
      async execute(callback) {
        const { isolationLevel, ...kyselyProps } = this.#props;
        const settings = { isolationLevel };
        validateTransactionSettings(settings);
        return this.#props.executor.provideConnection(async (connection) => {
          const executor = this.#props.executor.withConnectionProvider(new SingleConnectionProvider(connection));
          const transaction = new Transaction({
            ...kyselyProps,
            executor
          });
          try {
            await this.#props.driver.beginTransaction(connection, settings);
            const result = await callback(transaction);
            await this.#props.driver.commitTransaction(connection);
            return result;
          } catch (error) {
            await this.#props.driver.rollbackTransaction(connection);
            throw error;
          }
        });
      }
    };
    preventAwait(TransactionBuilder, "don't await TransactionBuilder instances directly. To execute the transaction you need to call the `execute` method");
  }
});

// node_modules/kysely/dist/esm/query-builder/where-interface.js
var init_where_interface = __esm({
  "node_modules/kysely/dist/esm/query-builder/where-interface.js"() {
  }
});

// node_modules/kysely/dist/esm/query-builder/returning-interface.js
var init_returning_interface = __esm({
  "node_modules/kysely/dist/esm/query-builder/returning-interface.js"() {
  }
});

// node_modules/kysely/dist/esm/query-builder/having-interface.js
var init_having_interface = __esm({
  "node_modules/kysely/dist/esm/query-builder/having-interface.js"() {
  }
});

// node_modules/kysely/dist/esm/raw-builder/raw-builder.js
function createRawBuilder(props) {
  return new RawBuilderImpl(props);
}
var RawBuilderImpl, AliasedRawBuilderImpl;
var init_raw_builder = __esm({
  "node_modules/kysely/dist/esm/raw-builder/raw-builder.js"() {
    init_alias_node();
    init_prevent_await();
    init_object_utils();
    init_noop_query_executor();
    init_identifier_node();
    init_operation_node_source();
    RawBuilderImpl = class _RawBuilderImpl {
      #props;
      constructor(props) {
        this.#props = freeze(props);
      }
      get expressionType() {
        return void 0;
      }
      get isRawBuilder() {
        return true;
      }
      as(alias) {
        return new AliasedRawBuilderImpl(this, alias);
      }
      $castTo() {
        return new _RawBuilderImpl({ ...this.#props });
      }
      withPlugin(plugin) {
        return new _RawBuilderImpl({
          ...this.#props,
          plugins: this.#props.plugins !== void 0 ? freeze([...this.#props.plugins, plugin]) : freeze([plugin])
        });
      }
      toOperationNode() {
        return this.#toOperationNode(this.#getExecutor());
      }
      compile(executorProvider) {
        return this.#compile(this.#getExecutor(executorProvider));
      }
      async execute(executorProvider) {
        const executor = this.#getExecutor(executorProvider);
        return executor.executeQuery(this.#compile(executor), this.#props.queryId);
      }
      #getExecutor(executorProvider) {
        const executor = executorProvider !== void 0 ? executorProvider.getExecutor() : NOOP_QUERY_EXECUTOR;
        return this.#props.plugins !== void 0 ? executor.withPlugins(this.#props.plugins) : executor;
      }
      #toOperationNode(executor) {
        return executor.transformQuery(this.#props.rawNode, this.#props.queryId);
      }
      #compile(executor) {
        return executor.compileQuery(this.#toOperationNode(executor), this.#props.queryId);
      }
    };
    preventAwait(RawBuilderImpl, "don't await RawBuilder instances directly. To execute the query you need to call `execute`");
    AliasedRawBuilderImpl = class {
      #rawBuilder;
      #alias;
      constructor(rawBuilder, alias) {
        this.#rawBuilder = rawBuilder;
        this.#alias = alias;
      }
      get expression() {
        return this.#rawBuilder;
      }
      get alias() {
        return this.#alias;
      }
      get rawBuilder() {
        return this.#rawBuilder;
      }
      toOperationNode() {
        return AliasNode.create(this.#rawBuilder.toOperationNode(), isOperationNodeSource(this.#alias) ? this.#alias.toOperationNode() : IdentifierNode.create(this.#alias));
      }
    };
    preventAwait(AliasedRawBuilderImpl, "don't await AliasedRawBuilder instances directly. AliasedRawBuilder should never be executed directly since it's always a part of another query.");
  }
});

// node_modules/kysely/dist/esm/raw-builder/sql.js
var sql;
var init_sql = __esm({
  "node_modules/kysely/dist/esm/raw-builder/sql.js"() {
    init_identifier_node();
    init_raw_node();
    init_value_node();
    init_reference_parser();
    init_table_parser();
    init_value_parser();
    init_query_id();
    init_raw_builder();
    sql = Object.assign((sqlFragments, ...parameters) => {
      return createRawBuilder({
        queryId: createQueryId(),
        rawNode: RawNode.create(sqlFragments, parameters?.map(parseValueExpression) ?? [])
      });
    }, {
      ref(columnReference) {
        return createRawBuilder({
          queryId: createQueryId(),
          rawNode: RawNode.createWithChild(parseStringReference(columnReference))
        });
      },
      val(value) {
        return createRawBuilder({
          queryId: createQueryId(),
          rawNode: RawNode.createWithChild(parseValueExpression(value))
        });
      },
      value(value) {
        return this.val(value);
      },
      table(tableReference) {
        return createRawBuilder({
          queryId: createQueryId(),
          rawNode: RawNode.createWithChild(parseTable(tableReference))
        });
      },
      id(...ids) {
        const fragments = new Array(ids.length + 1).fill(".");
        fragments[0] = "";
        fragments[fragments.length - 1] = "";
        return createRawBuilder({
          queryId: createQueryId(),
          rawNode: RawNode.create(fragments, ids.map(IdentifierNode.create))
        });
      },
      lit(value) {
        return createRawBuilder({
          queryId: createQueryId(),
          rawNode: RawNode.createWithChild(ValueNode.createImmediate(value))
        });
      },
      literal(value) {
        return this.lit(value);
      },
      raw(sql2) {
        return createRawBuilder({
          queryId: createQueryId(),
          rawNode: RawNode.createWithSql(sql2)
        });
      },
      join(array, separator = sql`, `) {
        const nodes = new Array(2 * array.length - 1);
        const sep = separator.toOperationNode();
        for (let i = 0; i < array.length; ++i) {
          nodes[2 * i] = parseValueExpression(array[i]);
          if (i !== array.length - 1) {
            nodes[2 * i + 1] = sep;
          }
        }
        return createRawBuilder({
          queryId: createQueryId(),
          rawNode: RawNode.createWithChildren(nodes)
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/query-executor/query-executor.js
var init_query_executor = __esm({
  "node_modules/kysely/dist/esm/query-executor/query-executor.js"() {
  }
});

// node_modules/kysely/dist/esm/query-executor/query-executor-provider.js
var init_query_executor_provider = __esm({
  "node_modules/kysely/dist/esm/query-executor/query-executor-provider.js"() {
  }
});

// node_modules/kysely/dist/esm/operation-node/operation-node-visitor.js
var OperationNodeVisitor;
var init_operation_node_visitor = __esm({
  "node_modules/kysely/dist/esm/operation-node/operation-node-visitor.js"() {
    init_object_utils();
    OperationNodeVisitor = class {
      nodeStack = [];
      get parentNode() {
        return this.nodeStack[this.nodeStack.length - 2];
      }
      #visitors = freeze({
        AliasNode: this.visitAlias.bind(this),
        ColumnNode: this.visitColumn.bind(this),
        IdentifierNode: this.visitIdentifier.bind(this),
        SchemableIdentifierNode: this.visitSchemableIdentifier.bind(this),
        RawNode: this.visitRaw.bind(this),
        ReferenceNode: this.visitReference.bind(this),
        SelectQueryNode: this.visitSelectQuery.bind(this),
        SelectionNode: this.visitSelection.bind(this),
        TableNode: this.visitTable.bind(this),
        FromNode: this.visitFrom.bind(this),
        SelectAllNode: this.visitSelectAll.bind(this),
        AndNode: this.visitAnd.bind(this),
        OrNode: this.visitOr.bind(this),
        ValueNode: this.visitValue.bind(this),
        ValueListNode: this.visitValueList.bind(this),
        PrimitiveValueListNode: this.visitPrimitiveValueList.bind(this),
        ParensNode: this.visitParens.bind(this),
        JoinNode: this.visitJoin.bind(this),
        OperatorNode: this.visitOperator.bind(this),
        WhereNode: this.visitWhere.bind(this),
        InsertQueryNode: this.visitInsertQuery.bind(this),
        DeleteQueryNode: this.visitDeleteQuery.bind(this),
        ReturningNode: this.visitReturning.bind(this),
        CreateTableNode: this.visitCreateTable.bind(this),
        AddColumnNode: this.visitAddColumn.bind(this),
        ColumnDefinitionNode: this.visitColumnDefinition.bind(this),
        DropTableNode: this.visitDropTable.bind(this),
        DataTypeNode: this.visitDataType.bind(this),
        OrderByNode: this.visitOrderBy.bind(this),
        OrderByItemNode: this.visitOrderByItem.bind(this),
        GroupByNode: this.visitGroupBy.bind(this),
        GroupByItemNode: this.visitGroupByItem.bind(this),
        UpdateQueryNode: this.visitUpdateQuery.bind(this),
        ColumnUpdateNode: this.visitColumnUpdate.bind(this),
        LimitNode: this.visitLimit.bind(this),
        OffsetNode: this.visitOffset.bind(this),
        OnConflictNode: this.visitOnConflict.bind(this),
        OnDuplicateKeyNode: this.visitOnDuplicateKey.bind(this),
        CreateIndexNode: this.visitCreateIndex.bind(this),
        DropIndexNode: this.visitDropIndex.bind(this),
        ListNode: this.visitList.bind(this),
        PrimaryKeyConstraintNode: this.visitPrimaryKeyConstraint.bind(this),
        UniqueConstraintNode: this.visitUniqueConstraint.bind(this),
        ReferencesNode: this.visitReferences.bind(this),
        CheckConstraintNode: this.visitCheckConstraint.bind(this),
        WithNode: this.visitWith.bind(this),
        CommonTableExpressionNode: this.visitCommonTableExpression.bind(this),
        CommonTableExpressionNameNode: this.visitCommonTableExpressionName.bind(this),
        HavingNode: this.visitHaving.bind(this),
        CreateSchemaNode: this.visitCreateSchema.bind(this),
        DropSchemaNode: this.visitDropSchema.bind(this),
        AlterTableNode: this.visitAlterTable.bind(this),
        DropColumnNode: this.visitDropColumn.bind(this),
        RenameColumnNode: this.visitRenameColumn.bind(this),
        AlterColumnNode: this.visitAlterColumn.bind(this),
        ModifyColumnNode: this.visitModifyColumn.bind(this),
        AddConstraintNode: this.visitAddConstraint.bind(this),
        DropConstraintNode: this.visitDropConstraint.bind(this),
        ForeignKeyConstraintNode: this.visitForeignKeyConstraint.bind(this),
        CreateViewNode: this.visitCreateView.bind(this),
        DropViewNode: this.visitDropView.bind(this),
        GeneratedNode: this.visitGenerated.bind(this),
        DefaultValueNode: this.visitDefaultValue.bind(this),
        OnNode: this.visitOn.bind(this),
        ValuesNode: this.visitValues.bind(this),
        SelectModifierNode: this.visitSelectModifier.bind(this),
        CreateTypeNode: this.visitCreateType.bind(this),
        DropTypeNode: this.visitDropType.bind(this),
        ExplainNode: this.visitExplain.bind(this),
        DefaultInsertValueNode: this.visitDefaultInsertValue.bind(this),
        AggregateFunctionNode: this.visitAggregateFunction.bind(this),
        OverNode: this.visitOver.bind(this),
        PartitionByNode: this.visitPartitionBy.bind(this),
        PartitionByItemNode: this.visitPartitionByItem.bind(this),
        SetOperationNode: this.visitSetOperation.bind(this),
        BinaryOperationNode: this.visitBinaryOperation.bind(this),
        UnaryOperationNode: this.visitUnaryOperation.bind(this),
        UsingNode: this.visitUsing.bind(this),
        FunctionNode: this.visitFunction.bind(this),
        CaseNode: this.visitCase.bind(this),
        WhenNode: this.visitWhen.bind(this),
        JSONReferenceNode: this.visitJSONReference.bind(this),
        JSONPathNode: this.visitJSONPath.bind(this),
        JSONPathLegNode: this.visitJSONPathLeg.bind(this),
        JSONOperatorChainNode: this.visitJSONOperatorChain.bind(this),
        TupleNode: this.visitTuple.bind(this)
      });
      visitNode = (node) => {
        this.nodeStack.push(node);
        this.#visitors[node.kind](node);
        this.nodeStack.pop();
      };
    };
  }
});

// node_modules/kysely/dist/esm/query-compiler/default-query-compiler.js
var DefaultQueryCompiler, SELECT_MODIFIER_SQL, SELECT_MODIFIER_PRIORITY, JOIN_TYPE_SQL;
var init_default_query_compiler = __esm({
  "node_modules/kysely/dist/esm/query-compiler/default-query-compiler.js"() {
    init_insert_query_node();
    init_operation_node_visitor();
    init_operator_node();
    init_parens_node();
    init_query_node();
    init_object_utils();
    init_create_view_node();
    init_set_operation_node();
    DefaultQueryCompiler = class extends OperationNodeVisitor {
      #sql = "";
      #parameters = [];
      get numParameters() {
        return this.#parameters.length;
      }
      compileQuery(node) {
        this.#sql = "";
        this.#parameters = [];
        this.visitNode(node);
        return freeze({
          query: node,
          sql: this.getSql(),
          parameters: [...this.#parameters]
        });
      }
      getSql() {
        return this.#sql;
      }
      visitSelectQuery(node) {
        const wrapInParens = this.parentNode !== void 0 && !ParensNode.is(this.parentNode) && !InsertQueryNode.is(this.parentNode) && !CreateViewNode.is(this.parentNode) && !SetOperationNode.is(this.parentNode);
        if (this.parentNode === void 0 && node.explain) {
          this.visitNode(node.explain);
          this.append(" ");
        }
        if (wrapInParens) {
          this.append("(");
        }
        if (node.with) {
          this.visitNode(node.with);
          this.append(" ");
        }
        this.append("select");
        if (node.distinctOn) {
          this.append(" ");
          this.compileDistinctOn(node.distinctOn);
        }
        if (node.frontModifiers?.length) {
          this.append(" ");
          this.compileList(node.frontModifiers, " ");
        }
        if (node.selections) {
          this.append(" ");
          this.compileList(node.selections);
        }
        if (node.from) {
          this.append(" ");
          this.visitNode(node.from);
        }
        if (node.joins) {
          this.append(" ");
          this.compileList(node.joins, " ");
        }
        if (node.where) {
          this.append(" ");
          this.visitNode(node.where);
        }
        if (node.groupBy) {
          this.append(" ");
          this.visitNode(node.groupBy);
        }
        if (node.having) {
          this.append(" ");
          this.visitNode(node.having);
        }
        if (node.setOperations) {
          this.append(" ");
          this.compileList(node.setOperations, " ");
        }
        if (node.orderBy) {
          this.append(" ");
          this.visitNode(node.orderBy);
        }
        if (node.limit) {
          this.append(" ");
          this.visitNode(node.limit);
        }
        if (node.offset) {
          this.append(" ");
          this.visitNode(node.offset);
        }
        if (node.endModifiers?.length) {
          this.append(" ");
          this.compileList(this.sortSelectModifiers([...node.endModifiers]), " ");
        }
        if (wrapInParens) {
          this.append(")");
        }
      }
      visitFrom(node) {
        this.append("from ");
        this.compileList(node.froms);
      }
      visitSelection(node) {
        this.visitNode(node.selection);
      }
      visitColumn(node) {
        this.visitNode(node.column);
      }
      compileDistinctOn(expressions) {
        this.append("distinct on (");
        this.compileList(expressions);
        this.append(")");
      }
      compileList(nodes, separator = ", ") {
        const lastIndex = nodes.length - 1;
        for (let i = 0; i <= lastIndex; i++) {
          this.visitNode(nodes[i]);
          if (i < lastIndex) {
            this.append(separator);
          }
        }
      }
      visitWhere(node) {
        this.append("where ");
        this.visitNode(node.where);
      }
      visitHaving(node) {
        this.append("having ");
        this.visitNode(node.having);
      }
      visitInsertQuery(node) {
        const isSubQuery = this.nodeStack.find(QueryNode.is) !== node;
        if (!isSubQuery && node.explain) {
          this.visitNode(node.explain);
          this.append(" ");
        }
        if (isSubQuery) {
          this.append("(");
        }
        if (node.with) {
          this.visitNode(node.with);
          this.append(" ");
        }
        this.append(node.replace ? "replace" : "insert");
        if (node.ignore) {
          this.append(" ignore");
        }
        this.append(" into ");
        this.visitNode(node.into);
        if (node.columns) {
          this.append(" (");
          this.compileList(node.columns);
          this.append(")");
        }
        if (node.values) {
          this.append(" ");
          this.visitNode(node.values);
        }
        if (node.onConflict) {
          this.append(" ");
          this.visitNode(node.onConflict);
        }
        if (node.onDuplicateKey) {
          this.append(" ");
          this.visitNode(node.onDuplicateKey);
        }
        if (node.returning) {
          this.append(" ");
          this.visitNode(node.returning);
        }
        if (isSubQuery) {
          this.append(")");
        }
      }
      visitValues(node) {
        this.append("values ");
        this.compileList(node.values);
      }
      visitDeleteQuery(node) {
        const isSubQuery = this.nodeStack.find(QueryNode.is) !== node;
        if (!isSubQuery && node.explain) {
          this.visitNode(node.explain);
          this.append(" ");
        }
        if (isSubQuery) {
          this.append("(");
        }
        if (node.with) {
          this.visitNode(node.with);
          this.append(" ");
        }
        this.append("delete ");
        this.visitNode(node.from);
        if (node.using) {
          this.append(" ");
          this.visitNode(node.using);
        }
        if (node.joins) {
          this.append(" ");
          this.compileList(node.joins, " ");
        }
        if (node.where) {
          this.append(" ");
          this.visitNode(node.where);
        }
        if (node.orderBy) {
          this.append(" ");
          this.visitNode(node.orderBy);
        }
        if (node.limit) {
          this.append(" ");
          this.visitNode(node.limit);
        }
        if (node.returning) {
          this.append(" ");
          this.visitNode(node.returning);
        }
        if (isSubQuery) {
          this.append(")");
        }
      }
      visitReturning(node) {
        this.append("returning ");
        this.compileList(node.selections);
      }
      visitAlias(node) {
        this.visitNode(node.node);
        this.append(" as ");
        this.visitNode(node.alias);
      }
      visitReference(node) {
        if (node.table) {
          this.visitNode(node.table);
          this.append(".");
        }
        this.visitNode(node.column);
      }
      visitSelectAll(_) {
        this.append("*");
      }
      visitIdentifier(node) {
        this.append(this.getLeftIdentifierWrapper());
        this.compileUnwrappedIdentifier(node);
        this.append(this.getRightIdentifierWrapper());
      }
      compileUnwrappedIdentifier(node) {
        if (!isString2(node.name)) {
          throw new Error("a non-string identifier was passed to compileUnwrappedIdentifier.");
        }
        this.append(this.sanitizeIdentifier(node.name));
      }
      visitAnd(node) {
        this.visitNode(node.left);
        this.append(" and ");
        this.visitNode(node.right);
      }
      visitOr(node) {
        this.visitNode(node.left);
        this.append(" or ");
        this.visitNode(node.right);
      }
      visitValue(node) {
        if (node.immediate) {
          this.appendImmediateValue(node.value);
        } else {
          this.appendValue(node.value);
        }
      }
      visitValueList(node) {
        this.append("(");
        this.compileList(node.values);
        this.append(")");
      }
      visitTuple(node) {
        this.append("(");
        this.compileList(node.values);
        this.append(")");
      }
      visitPrimitiveValueList(node) {
        this.append("(");
        const { values } = node;
        for (let i = 0; i < values.length; ++i) {
          this.appendValue(values[i]);
          if (i !== values.length - 1) {
            this.append(", ");
          }
        }
        this.append(")");
      }
      visitParens(node) {
        this.append("(");
        this.visitNode(node.node);
        this.append(")");
      }
      visitJoin(node) {
        this.append(JOIN_TYPE_SQL[node.joinType]);
        this.append(" ");
        this.visitNode(node.table);
        if (node.on) {
          this.append(" ");
          this.visitNode(node.on);
        }
      }
      visitOn(node) {
        this.append("on ");
        this.visitNode(node.on);
      }
      visitRaw(node) {
        const { sqlFragments, parameters: params } = node;
        for (let i = 0; i < sqlFragments.length; ++i) {
          this.append(sqlFragments[i]);
          if (params.length > i) {
            this.visitNode(params[i]);
          }
        }
      }
      visitOperator(node) {
        this.append(node.operator);
      }
      visitTable(node) {
        this.visitNode(node.table);
      }
      visitSchemableIdentifier(node) {
        if (node.schema) {
          this.visitNode(node.schema);
          this.append(".");
        }
        this.visitNode(node.identifier);
      }
      visitCreateTable(node) {
        this.append("create ");
        if (node.frontModifiers && node.frontModifiers.length > 0) {
          this.compileList(node.frontModifiers, " ");
          this.append(" ");
        }
        if (node.temporary) {
          this.append("temporary ");
        }
        this.append("table ");
        if (node.ifNotExists) {
          this.append("if not exists ");
        }
        this.visitNode(node.table);
        this.append(" (");
        this.compileList([...node.columns, ...node.constraints ?? []]);
        this.append(")");
        if (node.onCommit) {
          this.append(" on commit ");
          this.append(node.onCommit);
        }
        if (node.endModifiers && node.endModifiers.length > 0) {
          this.append(" ");
          this.compileList(node.endModifiers, " ");
        }
      }
      visitColumnDefinition(node) {
        this.visitNode(node.column);
        this.append(" ");
        this.visitNode(node.dataType);
        if (node.unsigned) {
          this.append(" unsigned");
        }
        if (node.frontModifiers && node.frontModifiers.length > 0) {
          this.append(" ");
          this.compileList(node.frontModifiers, " ");
        }
        if (node.generated) {
          this.append(" ");
          this.visitNode(node.generated);
        }
        if (node.defaultTo) {
          this.append(" ");
          this.visitNode(node.defaultTo);
        }
        if (node.notNull) {
          this.append(" not null");
        }
        if (node.unique) {
          this.append(" unique");
        }
        if (node.primaryKey) {
          this.append(" primary key");
        }
        if (node.autoIncrement) {
          this.append(" ");
          this.append(this.getAutoIncrement());
        }
        if (node.references) {
          this.append(" ");
          this.visitNode(node.references);
        }
        if (node.check) {
          this.append(" ");
          this.visitNode(node.check);
        }
        if (node.endModifiers && node.endModifiers.length > 0) {
          this.append(" ");
          this.compileList(node.endModifiers, " ");
        }
      }
      getAutoIncrement() {
        return "auto_increment";
      }
      visitReferences(node) {
        this.append("references ");
        this.visitNode(node.table);
        this.append(" (");
        this.compileList(node.columns);
        this.append(")");
        if (node.onDelete) {
          this.append(" on delete ");
          this.append(node.onDelete);
        }
        if (node.onUpdate) {
          this.append(" on update ");
          this.append(node.onUpdate);
        }
      }
      visitDropTable(node) {
        this.append("drop table ");
        if (node.ifExists) {
          this.append("if exists ");
        }
        this.visitNode(node.table);
        if (node.cascade) {
          this.append(" cascade");
        }
      }
      visitDataType(node) {
        this.append(node.dataType);
      }
      visitOrderBy(node) {
        this.append("order by ");
        this.compileList(node.items);
      }
      visitOrderByItem(node) {
        this.visitNode(node.orderBy);
        if (node.direction) {
          this.append(" ");
          this.visitNode(node.direction);
        }
      }
      visitGroupBy(node) {
        this.append("group by ");
        this.compileList(node.items);
      }
      visitGroupByItem(node) {
        this.visitNode(node.groupBy);
      }
      visitUpdateQuery(node) {
        const isSubQuery = this.nodeStack.find(QueryNode.is) !== node;
        if (!isSubQuery && node.explain) {
          this.visitNode(node.explain);
          this.append(" ");
        }
        if (isSubQuery) {
          this.append("(");
        }
        if (node.with) {
          this.visitNode(node.with);
          this.append(" ");
        }
        this.append("update ");
        this.visitNode(node.table);
        this.append(" set ");
        if (node.updates) {
          this.compileList(node.updates);
        }
        if (node.from) {
          this.append(" ");
          this.visitNode(node.from);
        }
        if (node.joins) {
          this.append(" ");
          this.compileList(node.joins, " ");
        }
        if (node.where) {
          this.append(" ");
          this.visitNode(node.where);
        }
        if (node.returning) {
          this.append(" ");
          this.visitNode(node.returning);
        }
        if (isSubQuery) {
          this.append(")");
        }
      }
      visitColumnUpdate(node) {
        this.visitNode(node.column);
        this.append(" = ");
        this.visitNode(node.value);
      }
      visitLimit(node) {
        this.append("limit ");
        this.visitNode(node.limit);
      }
      visitOffset(node) {
        this.append("offset ");
        this.visitNode(node.offset);
      }
      visitOnConflict(node) {
        this.append("on conflict");
        if (node.columns) {
          this.append(" (");
          this.compileList(node.columns);
          this.append(")");
        } else if (node.constraint) {
          this.append(" on constraint ");
          this.visitNode(node.constraint);
        } else if (node.indexExpression) {
          this.append(" (");
          this.visitNode(node.indexExpression);
          this.append(")");
        }
        if (node.indexWhere) {
          this.append(" ");
          this.visitNode(node.indexWhere);
        }
        if (node.doNothing === true) {
          this.append(" do nothing");
        } else if (node.updates) {
          this.append(" do update set ");
          this.compileList(node.updates);
          if (node.updateWhere) {
            this.append(" ");
            this.visitNode(node.updateWhere);
          }
        }
      }
      visitOnDuplicateKey(node) {
        this.append("on duplicate key update ");
        this.compileList(node.updates);
      }
      visitCreateIndex(node) {
        this.append("create ");
        if (node.unique) {
          this.append("unique ");
        }
        this.append("index ");
        if (node.ifNotExists) {
          this.append("if not exists ");
        }
        this.visitNode(node.name);
        if (node.table) {
          this.append(" on ");
          this.visitNode(node.table);
        }
        if (node.using) {
          this.append(" using ");
          this.visitNode(node.using);
        }
        if (node.columns) {
          this.append(" (");
          this.compileList(node.columns);
          this.append(")");
        }
        if (node.where) {
          this.append(" ");
          this.visitNode(node.where);
        }
      }
      visitDropIndex(node) {
        this.append("drop index ");
        if (node.ifExists) {
          this.append("if exists ");
        }
        this.visitNode(node.name);
        if (node.table) {
          this.append(" on ");
          this.visitNode(node.table);
        }
        if (node.cascade) {
          this.append(" cascade");
        }
      }
      visitCreateSchema(node) {
        this.append("create schema ");
        if (node.ifNotExists) {
          this.append("if not exists ");
        }
        this.visitNode(node.schema);
      }
      visitDropSchema(node) {
        this.append("drop schema ");
        if (node.ifExists) {
          this.append("if exists ");
        }
        this.visitNode(node.schema);
        if (node.cascade) {
          this.append(" cascade");
        }
      }
      visitPrimaryKeyConstraint(node) {
        if (node.name) {
          this.append("constraint ");
          this.visitNode(node.name);
          this.append(" ");
        }
        this.append("primary key (");
        this.compileList(node.columns);
        this.append(")");
      }
      visitUniqueConstraint(node) {
        if (node.name) {
          this.append("constraint ");
          this.visitNode(node.name);
          this.append(" ");
        }
        this.append("unique (");
        this.compileList(node.columns);
        this.append(")");
      }
      visitCheckConstraint(node) {
        if (node.name) {
          this.append("constraint ");
          this.visitNode(node.name);
          this.append(" ");
        }
        this.append("check (");
        this.visitNode(node.expression);
        this.append(")");
      }
      visitForeignKeyConstraint(node) {
        if (node.name) {
          this.append("constraint ");
          this.visitNode(node.name);
          this.append(" ");
        }
        this.append("foreign key (");
        this.compileList(node.columns);
        this.append(") ");
        this.visitNode(node.references);
        if (node.onDelete) {
          this.append(" on delete ");
          this.append(node.onDelete);
        }
        if (node.onUpdate) {
          this.append(" on update ");
          this.append(node.onUpdate);
        }
      }
      visitList(node) {
        this.compileList(node.items);
      }
      visitWith(node) {
        this.append("with ");
        if (node.recursive) {
          this.append("recursive ");
        }
        this.compileList(node.expressions);
      }
      visitCommonTableExpression(node) {
        this.visitNode(node.name);
        this.append(" as ");
        if (isBoolean2(node.materialized)) {
          if (!node.materialized) {
            this.append("not ");
          }
          this.append("materialized ");
        }
        this.visitNode(node.expression);
      }
      visitCommonTableExpressionName(node) {
        this.visitNode(node.table);
        if (node.columns) {
          this.append("(");
          this.compileList(node.columns);
          this.append(")");
        }
      }
      visitAlterTable(node) {
        this.append("alter table ");
        this.visitNode(node.table);
        this.append(" ");
        if (node.renameTo) {
          this.append("rename to ");
          this.visitNode(node.renameTo);
        }
        if (node.setSchema) {
          this.append("set schema ");
          this.visitNode(node.setSchema);
        }
        if (node.addConstraint) {
          this.visitNode(node.addConstraint);
        }
        if (node.dropConstraint) {
          this.visitNode(node.dropConstraint);
        }
        if (node.columnAlterations) {
          this.compileList(node.columnAlterations);
        }
      }
      visitAddColumn(node) {
        this.append("add column ");
        this.visitNode(node.column);
      }
      visitRenameColumn(node) {
        this.append("rename column ");
        this.visitNode(node.column);
        this.append(" to ");
        this.visitNode(node.renameTo);
      }
      visitDropColumn(node) {
        this.append("drop column ");
        this.visitNode(node.column);
      }
      visitAlterColumn(node) {
        this.append("alter column ");
        this.visitNode(node.column);
        this.append(" ");
        if (node.dataType) {
          this.append("type ");
          this.visitNode(node.dataType);
          if (node.dataTypeExpression) {
            this.append("using ");
            this.visitNode(node.dataTypeExpression);
          }
        }
        if (node.setDefault) {
          this.append("set default ");
          this.visitNode(node.setDefault);
        }
        if (node.dropDefault) {
          this.append("drop default");
        }
        if (node.setNotNull) {
          this.append("set not null");
        }
        if (node.dropNotNull) {
          this.append("drop not null");
        }
      }
      visitModifyColumn(node) {
        this.append("modify column ");
        this.visitNode(node.column);
      }
      visitAddConstraint(node) {
        this.append("add ");
        this.visitNode(node.constraint);
      }
      visitDropConstraint(node) {
        this.append("drop constraint ");
        if (node.ifExists) {
          this.append("if exists ");
        }
        this.visitNode(node.constraintName);
        if (node.modifier === "cascade") {
          this.append(" cascade");
        } else if (node.modifier === "restrict") {
          this.append(" restrict");
        }
      }
      visitSetOperation(node) {
        this.append(node.operator);
        this.append(" ");
        if (node.all) {
          this.append("all ");
        }
        this.visitNode(node.expression);
      }
      visitCreateView(node) {
        this.append("create ");
        if (node.orReplace) {
          this.append("or replace ");
        }
        if (node.materialized) {
          this.append("materialized ");
        }
        if (node.temporary) {
          this.append("temporary ");
        }
        this.append("view ");
        if (node.ifNotExists) {
          this.append("if not exists ");
        }
        this.visitNode(node.name);
        this.append(" ");
        if (node.columns) {
          this.append("(");
          this.compileList(node.columns);
          this.append(") ");
        }
        if (node.as) {
          this.append("as ");
          this.visitNode(node.as);
        }
      }
      visitDropView(node) {
        this.append("drop ");
        if (node.materialized) {
          this.append("materialized ");
        }
        this.append("view ");
        if (node.ifExists) {
          this.append("if exists ");
        }
        this.visitNode(node.name);
        if (node.cascade) {
          this.append(" cascade");
        }
      }
      visitGenerated(node) {
        this.append("generated ");
        if (node.always) {
          this.append("always ");
        }
        if (node.byDefault) {
          this.append("by default ");
        }
        this.append("as ");
        if (node.identity) {
          this.append("identity");
        }
        if (node.expression) {
          this.append("(");
          this.visitNode(node.expression);
          this.append(")");
        }
        if (node.stored) {
          this.append(" stored");
        }
      }
      visitDefaultValue(node) {
        this.append("default ");
        this.visitNode(node.defaultValue);
      }
      visitSelectModifier(node) {
        if (node.rawModifier) {
          this.visitNode(node.rawModifier);
        } else {
          this.append(SELECT_MODIFIER_SQL[node.modifier]);
        }
      }
      visitCreateType(node) {
        this.append("create type ");
        this.visitNode(node.name);
        if (node.enum) {
          this.append(" as enum ");
          this.visitNode(node.enum);
        }
      }
      visitDropType(node) {
        this.append("drop type ");
        if (node.ifExists) {
          this.append("if exists ");
        }
        this.visitNode(node.name);
      }
      visitExplain(node) {
        this.append("explain");
        if (node.options || node.format) {
          this.append(" ");
          this.append(this.getLeftExplainOptionsWrapper());
          if (node.options) {
            this.visitNode(node.options);
            if (node.format) {
              this.append(this.getExplainOptionsDelimiter());
            }
          }
          if (node.format) {
            this.append("format");
            this.append(this.getExplainOptionAssignment());
            this.append(node.format);
          }
          this.append(this.getRightExplainOptionsWrapper());
        }
      }
      visitDefaultInsertValue(_) {
        this.append("default");
      }
      visitAggregateFunction(node) {
        this.append(node.func);
        this.append("(");
        if (node.distinct) {
          this.append("distinct ");
        }
        this.compileList(node.aggregated);
        this.append(")");
        if (node.filter) {
          this.append(" filter(");
          this.visitNode(node.filter);
          this.append(")");
        }
        if (node.over) {
          this.append(" ");
          this.visitNode(node.over);
        }
      }
      visitOver(node) {
        this.append("over(");
        if (node.partitionBy) {
          this.visitNode(node.partitionBy);
          if (node.orderBy) {
            this.append(" ");
          }
        }
        if (node.orderBy) {
          this.visitNode(node.orderBy);
        }
        this.append(")");
      }
      visitPartitionBy(node) {
        this.append("partition by ");
        this.compileList(node.items);
      }
      visitPartitionByItem(node) {
        this.visitNode(node.partitionBy);
      }
      visitBinaryOperation(node) {
        this.visitNode(node.leftOperand);
        this.append(" ");
        this.visitNode(node.operator);
        this.append(" ");
        this.visitNode(node.rightOperand);
      }
      visitUnaryOperation(node) {
        this.visitNode(node.operator);
        if (!this.isMinusOperator(node.operator)) {
          this.append(" ");
        }
        this.visitNode(node.operand);
      }
      isMinusOperator(node) {
        return OperatorNode.is(node) && node.operator === "-";
      }
      visitUsing(node) {
        this.append("using ");
        this.compileList(node.tables);
      }
      visitFunction(node) {
        this.append(node.func);
        this.append("(");
        this.compileList(node.arguments);
        this.append(")");
      }
      visitCase(node) {
        this.append("case");
        if (node.value) {
          this.append(" ");
          this.visitNode(node.value);
        }
        if (node.when) {
          this.append(" ");
          this.compileList(node.when, " ");
        }
        if (node.else) {
          this.append(" else ");
          this.visitNode(node.else);
        }
        this.append(" end");
        if (node.isStatement) {
          this.append(" case");
        }
      }
      visitWhen(node) {
        this.append("when ");
        this.visitNode(node.condition);
        if (node.result) {
          this.append(" then ");
          this.visitNode(node.result);
        }
      }
      visitJSONReference(node) {
        this.visitNode(node.reference);
        this.visitNode(node.traversal);
      }
      visitJSONPath(node) {
        if (node.inOperator) {
          this.visitNode(node.inOperator);
        }
        this.append("'$");
        for (const pathLeg of node.pathLegs) {
          this.visitNode(pathLeg);
        }
        this.append("'");
      }
      visitJSONPathLeg(node) {
        const isArrayLocation = node.type === "ArrayLocation";
        this.append(isArrayLocation ? "[" : ".");
        this.append(String(node.value));
        if (isArrayLocation) {
          this.append("]");
        }
      }
      visitJSONOperatorChain(node) {
        for (let i = 0, len = node.values.length; i < len; i++) {
          if (i === len - 1) {
            this.visitNode(node.operator);
          } else {
            this.append("->");
          }
          this.visitNode(node.values[i]);
        }
      }
      append(str) {
        this.#sql += str;
      }
      appendValue(parameter) {
        this.addParameter(parameter);
        this.append(this.getCurrentParameterPlaceholder());
      }
      getLeftIdentifierWrapper() {
        return '"';
      }
      getRightIdentifierWrapper() {
        return '"';
      }
      getCurrentParameterPlaceholder() {
        return "$" + this.numParameters;
      }
      getLeftExplainOptionsWrapper() {
        return "(";
      }
      getExplainOptionAssignment() {
        return " ";
      }
      getExplainOptionsDelimiter() {
        return ", ";
      }
      getRightExplainOptionsWrapper() {
        return ")";
      }
      sanitizeIdentifier(identifier) {
        const leftWrap = this.getLeftIdentifierWrapper();
        const rightWrap = this.getRightIdentifierWrapper();
        let sanitized = "";
        for (const c of identifier) {
          sanitized += c;
          if (c === leftWrap) {
            sanitized += leftWrap;
          } else if (c === rightWrap) {
            sanitized += rightWrap;
          }
        }
        return sanitized;
      }
      addParameter(parameter) {
        this.#parameters.push(parameter);
      }
      appendImmediateValue(value) {
        if (isString2(value)) {
          this.append(`'${value}'`);
        } else if (isNumber2(value) || isBoolean2(value)) {
          this.append(value.toString());
        } else if (isNull3(value)) {
          this.append("null");
        } else if (isDate2(value)) {
          this.appendImmediateValue(value.toISOString());
        } else if (isBigInt(value)) {
          this.appendImmediateValue(value.toString());
        } else {
          throw new Error(`invalid immediate value ${value}`);
        }
      }
      sortSelectModifiers(arr) {
        arr.sort((left, right) => left.modifier && right.modifier ? SELECT_MODIFIER_PRIORITY[left.modifier] - SELECT_MODIFIER_PRIORITY[right.modifier] : 1);
        return freeze(arr);
      }
    };
    SELECT_MODIFIER_SQL = freeze({
      ForKeyShare: "for key share",
      ForNoKeyUpdate: "for no key update",
      ForUpdate: "for update",
      ForShare: "for share",
      NoWait: "nowait",
      SkipLocked: "skip locked",
      Distinct: "distinct"
    });
    SELECT_MODIFIER_PRIORITY = freeze({
      ForKeyShare: 1,
      ForNoKeyUpdate: 1,
      ForUpdate: 1,
      ForShare: 1,
      NoWait: 2,
      SkipLocked: 2,
      Distinct: 0
    });
    JOIN_TYPE_SQL = freeze({
      InnerJoin: "inner join",
      LeftJoin: "left join",
      RightJoin: "right join",
      FullJoin: "full join",
      LateralInnerJoin: "inner join lateral",
      LateralLeftJoin: "left join lateral"
    });
  }
});

// node_modules/kysely/dist/esm/query-compiler/compiled-query.js
var CompiledQuery;
var init_compiled_query = __esm({
  "node_modules/kysely/dist/esm/query-compiler/compiled-query.js"() {
    init_raw_node();
    init_object_utils();
    CompiledQuery = freeze({
      raw(sql2, parameters = []) {
        return freeze({
          sql: sql2,
          query: RawNode.createWithSql(sql2),
          parameters: freeze(parameters)
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/driver/database-connection.js
var init_database_connection = __esm({
  "node_modules/kysely/dist/esm/driver/database-connection.js"() {
  }
});

// node_modules/kysely/dist/esm/driver/connection-provider.js
var init_connection_provider = __esm({
  "node_modules/kysely/dist/esm/driver/connection-provider.js"() {
  }
});

// node_modules/kysely/dist/esm/driver/dummy-driver.js
var init_dummy_driver = __esm({
  "node_modules/kysely/dist/esm/driver/dummy-driver.js"() {
  }
});

// node_modules/kysely/dist/esm/dialect/dialect.js
var init_dialect = __esm({
  "node_modules/kysely/dist/esm/dialect/dialect.js"() {
  }
});

// node_modules/kysely/dist/esm/dialect/dialect-adapter.js
var init_dialect_adapter = __esm({
  "node_modules/kysely/dist/esm/dialect/dialect-adapter.js"() {
  }
});

// node_modules/kysely/dist/esm/dialect/dialect-adapter-base.js
var DialectAdapterBase;
var init_dialect_adapter_base = __esm({
  "node_modules/kysely/dist/esm/dialect/dialect-adapter-base.js"() {
    DialectAdapterBase = class {
      get supportsTransactionalDdl() {
        return false;
      }
      get supportsReturning() {
        return false;
      }
    };
  }
});

// node_modules/kysely/dist/esm/dialect/database-introspector.js
var init_database_introspector = __esm({
  "node_modules/kysely/dist/esm/dialect/database-introspector.js"() {
  }
});

// node_modules/kysely/dist/esm/dialect/sqlite/sqlite-driver.js
var init_sqlite_driver = __esm({
  "node_modules/kysely/dist/esm/dialect/sqlite/sqlite-driver.js"() {
  }
});

// node_modules/kysely/dist/esm/dialect/sqlite/sqlite-query-compiler.js
var init_sqlite_query_compiler = __esm({
  "node_modules/kysely/dist/esm/dialect/sqlite/sqlite-query-compiler.js"() {
  }
});

// node_modules/kysely/dist/esm/migration/migrator.js
var DEFAULT_MIGRATION_TABLE, DEFAULT_MIGRATION_LOCK_TABLE, NO_MIGRATIONS;
var init_migrator = __esm({
  "node_modules/kysely/dist/esm/migration/migrator.js"() {
    init_object_utils();
    DEFAULT_MIGRATION_TABLE = "kysely_migration";
    DEFAULT_MIGRATION_LOCK_TABLE = "kysely_migration_lock";
    NO_MIGRATIONS = freeze({ __noMigrations__: true });
  }
});

// node_modules/kysely/dist/esm/dialect/sqlite/sqlite-introspector.js
var init_sqlite_introspector = __esm({
  "node_modules/kysely/dist/esm/dialect/sqlite/sqlite-introspector.js"() {
  }
});

// node_modules/kysely/dist/esm/dialect/sqlite/sqlite-adapter.js
var init_sqlite_adapter = __esm({
  "node_modules/kysely/dist/esm/dialect/sqlite/sqlite-adapter.js"() {
  }
});

// node_modules/kysely/dist/esm/dialect/sqlite/sqlite-dialect.js
var init_sqlite_dialect = __esm({
  "node_modules/kysely/dist/esm/dialect/sqlite/sqlite-dialect.js"() {
  }
});

// node_modules/kysely/dist/esm/dialect/sqlite/sqlite-dialect-config.js
var init_sqlite_dialect_config = __esm({
  "node_modules/kysely/dist/esm/dialect/sqlite/sqlite-dialect-config.js"() {
  }
});

// node_modules/kysely/dist/esm/dialect/postgres/postgres-query-compiler.js
var ID_WRAP_REGEX, PostgresQueryCompiler;
var init_postgres_query_compiler = __esm({
  "node_modules/kysely/dist/esm/dialect/postgres/postgres-query-compiler.js"() {
    init_default_query_compiler();
    ID_WRAP_REGEX = /"/g;
    PostgresQueryCompiler = class extends DefaultQueryCompiler {
      sanitizeIdentifier(identifier) {
        return identifier.replace(ID_WRAP_REGEX, '""');
      }
    };
  }
});

// node_modules/kysely/dist/esm/dialect/postgres/postgres-introspector.js
var PostgresIntrospector;
var init_postgres_introspector = __esm({
  "node_modules/kysely/dist/esm/dialect/postgres/postgres-introspector.js"() {
    init_migrator();
    init_object_utils();
    init_sql();
    PostgresIntrospector = class {
      #db;
      constructor(db2) {
        this.#db = db2;
      }
      async getSchemas() {
        let rawSchemas = await this.#db.selectFrom("pg_catalog.pg_namespace").select("nspname").$castTo().execute();
        return rawSchemas.map((it) => ({ name: it.nspname }));
      }
      async getTables(options = { withInternalKyselyTables: false }) {
        let query = this.#db.selectFrom("pg_catalog.pg_attribute as a").innerJoin("pg_catalog.pg_class as c", "a.attrelid", "c.oid").innerJoin("pg_catalog.pg_namespace as ns", "c.relnamespace", "ns.oid").innerJoin("pg_catalog.pg_type as typ", "a.atttypid", "typ.oid").innerJoin("pg_catalog.pg_namespace as dtns", "typ.typnamespace", "dtns.oid").select([
          "a.attname as column",
          "a.attnotnull as not_null",
          "a.atthasdef as has_default",
          "c.relname as table",
          "c.relkind as table_type",
          "ns.nspname as schema",
          "typ.typname as type",
          "dtns.nspname as type_schema",
          // Detect if the column is auto incrementing by finding the sequence
          // that is created for `serial` and `bigserial` columns.
          this.#db.selectFrom("pg_class").select(sql`true`.as("auto_incrementing")).whereRef("relnamespace", "=", "c.relnamespace").where("relkind", "=", "S").where("relname", "=", sql`c.relname || '_' || a.attname || '_seq'`).as("auto_incrementing")
        ]).where((eb) => eb.or([eb("c.relkind", "=", "r"), eb("c.relkind", "=", "v")])).where("ns.nspname", "!~", "^pg_").where("ns.nspname", "!=", "information_schema").where("a.attnum", ">=", 0).where("a.attisdropped", "!=", true).orderBy("ns.nspname").orderBy("c.relname").orderBy("a.attnum").$castTo();
        if (!options.withInternalKyselyTables) {
          query = query.where("c.relname", "!=", DEFAULT_MIGRATION_TABLE).where("c.relname", "!=", DEFAULT_MIGRATION_LOCK_TABLE);
        }
        const rawColumns = await query.execute();
        return this.#parseTableMetadata(rawColumns);
      }
      async getMetadata(options) {
        return {
          tables: await this.getTables(options)
        };
      }
      #parseTableMetadata(columns) {
        return columns.reduce((tables, it) => {
          let table = tables.find((tbl) => tbl.name === it.table && tbl.schema === it.schema);
          if (!table) {
            table = freeze({
              name: it.table,
              isView: it.table_type === "v",
              schema: it.schema,
              columns: []
            });
            tables.push(table);
          }
          table.columns.push(freeze({
            name: it.column,
            dataType: it.type,
            dataTypeSchema: it.type_schema,
            isNullable: !it.not_null,
            isAutoIncrementing: !!it.auto_incrementing,
            hasDefaultValue: it.has_default
          }));
          return tables;
        }, []);
      }
    };
  }
});

// node_modules/kysely/dist/esm/dialect/postgres/postgres-adapter.js
var LOCK_ID, PostgresAdapter;
var init_postgres_adapter = __esm({
  "node_modules/kysely/dist/esm/dialect/postgres/postgres-adapter.js"() {
    init_sql();
    init_dialect_adapter_base();
    LOCK_ID = BigInt("3853314791062309107");
    PostgresAdapter = class extends DialectAdapterBase {
      get supportsTransactionalDdl() {
        return true;
      }
      get supportsReturning() {
        return true;
      }
      async acquireMigrationLock(db2, _opt) {
        await sql`select pg_advisory_xact_lock(${sql.lit(LOCK_ID)})`.execute(db2);
      }
      async releaseMigrationLock(_db, _opt) {
      }
    };
  }
});

// node_modules/kysely/dist/esm/util/stack-trace-utils.js
function extendStackTrace(err, stackError) {
  if (isStackHolder(err) && stackError.stack) {
    const stackExtension = stackError.stack.split("\n").slice(1).join("\n");
    err.stack += `
${stackExtension}`;
    return err;
  }
  return err;
}
function isStackHolder(obj) {
  return isObject(obj) && isString2(obj.stack);
}
var init_stack_trace_utils = __esm({
  "node_modules/kysely/dist/esm/util/stack-trace-utils.js"() {
    init_object_utils();
  }
});

// node_modules/kysely/dist/esm/dialect/mysql/mysql-driver.js
function isOkPacket(obj) {
  return isObject(obj) && "insertId" in obj && "affectedRows" in obj;
}
var PRIVATE_RELEASE_METHOD, MysqlConnection;
var init_mysql_driver = __esm({
  "node_modules/kysely/dist/esm/dialect/mysql/mysql-driver.js"() {
    init_object_utils();
    init_stack_trace_utils();
    PRIVATE_RELEASE_METHOD = /* @__PURE__ */ Symbol();
    MysqlConnection = class {
      #rawConnection;
      constructor(rawConnection) {
        this.#rawConnection = rawConnection;
      }
      async executeQuery(compiledQuery) {
        try {
          const result = await this.#executeQuery(compiledQuery);
          if (isOkPacket(result)) {
            const { insertId, affectedRows, changedRows } = result;
            const numAffectedRows = affectedRows !== void 0 && affectedRows !== null ? BigInt(affectedRows) : void 0;
            const numChangedRows = changedRows !== void 0 && changedRows !== null ? BigInt(changedRows) : void 0;
            return {
              insertId: insertId !== void 0 && insertId !== null && insertId.toString() !== "0" ? BigInt(insertId) : void 0,
              // TODO: remove.
              numUpdatedOrDeletedRows: numAffectedRows,
              numAffectedRows,
              numChangedRows,
              rows: []
            };
          } else if (Array.isArray(result)) {
            return {
              rows: result
            };
          }
          return {
            rows: []
          };
        } catch (err) {
          throw extendStackTrace(err, new Error());
        }
      }
      #executeQuery(compiledQuery) {
        return new Promise((resolve, reject) => {
          this.#rawConnection.query(compiledQuery.sql, compiledQuery.parameters, (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
        });
      }
      async *streamQuery(compiledQuery, _chunkSize) {
        const stream = this.#rawConnection.query(compiledQuery.sql, compiledQuery.parameters).stream({
          objectMode: true
        });
        try {
          for await (const row of stream) {
            yield {
              rows: [row]
            };
          }
        } catch (ex) {
          if (ex && typeof ex === "object" && "code" in ex && // @ts-ignore
          ex.code === "ERR_STREAM_PREMATURE_CLOSE") {
            return;
          }
          throw ex;
        }
      }
      [PRIVATE_RELEASE_METHOD]() {
        this.#rawConnection.release();
      }
    };
  }
});

// node_modules/kysely/dist/esm/dialect/mysql/mysql-query-compiler.js
var init_mysql_query_compiler = __esm({
  "node_modules/kysely/dist/esm/dialect/mysql/mysql-query-compiler.js"() {
  }
});

// node_modules/kysely/dist/esm/dialect/mysql/mysql-introspector.js
var init_mysql_introspector = __esm({
  "node_modules/kysely/dist/esm/dialect/mysql/mysql-introspector.js"() {
  }
});

// node_modules/kysely/dist/esm/dialect/mysql/mysql-adapter.js
var LOCK_TIMEOUT_SECONDS;
var init_mysql_adapter = __esm({
  "node_modules/kysely/dist/esm/dialect/mysql/mysql-adapter.js"() {
    LOCK_TIMEOUT_SECONDS = 60 * 60;
  }
});

// node_modules/kysely/dist/esm/dialect/mysql/mysql-dialect.js
var init_mysql_dialect = __esm({
  "node_modules/kysely/dist/esm/dialect/mysql/mysql-dialect.js"() {
  }
});

// node_modules/kysely/dist/esm/dialect/mysql/mysql-dialect-config.js
var init_mysql_dialect_config = __esm({
  "node_modules/kysely/dist/esm/dialect/mysql/mysql-dialect-config.js"() {
  }
});

// node_modules/kysely/dist/esm/dialect/postgres/postgres-driver.js
var PRIVATE_RELEASE_METHOD2, PostgresDriver, PostgresConnection;
var init_postgres_driver = __esm({
  "node_modules/kysely/dist/esm/dialect/postgres/postgres-driver.js"() {
    init_compiled_query();
    init_object_utils();
    init_stack_trace_utils();
    PRIVATE_RELEASE_METHOD2 = /* @__PURE__ */ Symbol();
    PostgresDriver = class {
      #config;
      #connections = /* @__PURE__ */ new WeakMap();
      #pool;
      constructor(config) {
        this.#config = freeze({ ...config });
      }
      async init() {
        this.#pool = isFunction(this.#config.pool) ? await this.#config.pool() : this.#config.pool;
      }
      async acquireConnection() {
        const client = await this.#pool.connect();
        let connection = this.#connections.get(client);
        if (!connection) {
          connection = new PostgresConnection(client, {
            cursor: this.#config.cursor ?? null
          });
          this.#connections.set(client, connection);
          if (this.#config?.onCreateConnection) {
            await this.#config.onCreateConnection(connection);
          }
        }
        return connection;
      }
      async beginTransaction(connection, settings) {
        if (settings.isolationLevel) {
          await connection.executeQuery(CompiledQuery.raw(`start transaction isolation level ${settings.isolationLevel}`));
        } else {
          await connection.executeQuery(CompiledQuery.raw("begin"));
        }
      }
      async commitTransaction(connection) {
        await connection.executeQuery(CompiledQuery.raw("commit"));
      }
      async rollbackTransaction(connection) {
        await connection.executeQuery(CompiledQuery.raw("rollback"));
      }
      async releaseConnection(connection) {
        connection[PRIVATE_RELEASE_METHOD2]();
      }
      async destroy() {
        if (this.#pool) {
          const pool = this.#pool;
          this.#pool = void 0;
          await pool.end();
        }
      }
    };
    PostgresConnection = class {
      #client;
      #options;
      constructor(client, options) {
        this.#client = client;
        this.#options = options;
      }
      async executeQuery(compiledQuery) {
        try {
          const result = await this.#client.query(compiledQuery.sql, [
            ...compiledQuery.parameters
          ]);
          if (result.command === "INSERT" || result.command === "UPDATE" || result.command === "DELETE") {
            const numAffectedRows = BigInt(result.rowCount);
            return {
              // TODO: remove.
              numUpdatedOrDeletedRows: numAffectedRows,
              numAffectedRows,
              rows: result.rows ?? []
            };
          }
          return {
            rows: result.rows ?? []
          };
        } catch (err) {
          throw extendStackTrace(err, new Error());
        }
      }
      async *streamQuery(compiledQuery, chunkSize) {
        if (!this.#options.cursor) {
          throw new Error("'cursor' is not present in your postgres dialect config. It's required to make streaming work in postgres.");
        }
        if (!Number.isInteger(chunkSize) || chunkSize <= 0) {
          throw new Error("chunkSize must be a positive integer");
        }
        const cursor = this.#client.query(new this.#options.cursor(compiledQuery.sql, compiledQuery.parameters.slice()));
        try {
          while (true) {
            const rows = await cursor.read(chunkSize);
            if (rows.length === 0) {
              break;
            }
            yield {
              rows
            };
          }
        } finally {
          await cursor.close();
        }
      }
      [PRIVATE_RELEASE_METHOD2]() {
        this.#client.release();
      }
    };
  }
});

// node_modules/kysely/dist/esm/dialect/postgres/postgres-dialect-config.js
var init_postgres_dialect_config = __esm({
  "node_modules/kysely/dist/esm/dialect/postgres/postgres-dialect-config.js"() {
  }
});

// node_modules/kysely/dist/esm/dialect/postgres/postgres-dialect.js
var init_postgres_dialect = __esm({
  "node_modules/kysely/dist/esm/dialect/postgres/postgres-dialect.js"() {
  }
});

// node_modules/kysely/dist/esm/query-compiler/query-compiler.js
var init_query_compiler = __esm({
  "node_modules/kysely/dist/esm/query-compiler/query-compiler.js"() {
  }
});

// node_modules/kysely/dist/esm/migration/file-migration-provider.js
var init_file_migration_provider = __esm({
  "node_modules/kysely/dist/esm/migration/file-migration-provider.js"() {
  }
});

// node_modules/kysely/dist/esm/plugin/kysely-plugin.js
var init_kysely_plugin = __esm({
  "node_modules/kysely/dist/esm/plugin/kysely-plugin.js"() {
  }
});

// node_modules/kysely/dist/esm/plugin/camel-case/camel-case-transformer.js
var SnakeCaseTransformer;
var init_camel_case_transformer = __esm({
  "node_modules/kysely/dist/esm/plugin/camel-case/camel-case-transformer.js"() {
    init_operation_node_transformer();
    SnakeCaseTransformer = class extends OperationNodeTransformer {
      #snakeCase;
      constructor(snakeCase) {
        super();
        this.#snakeCase = snakeCase;
      }
      transformIdentifier(node) {
        node = super.transformIdentifier(node);
        return {
          ...node,
          name: this.#snakeCase(node.name)
        };
      }
    };
  }
});

// node_modules/kysely/dist/esm/plugin/camel-case/camel-case.js
function createSnakeCaseMapper({ upperCase = false, underscoreBeforeDigits = false, underscoreBetweenUppercaseLetters = false } = {}) {
  return memoize((str) => {
    if (str.length === 0) {
      return str;
    }
    const upper = str.toUpperCase();
    const lower = str.toLowerCase();
    let out = lower[0];
    for (let i = 1, l = str.length; i < l; ++i) {
      const char = str[i];
      const prevChar = str[i - 1];
      const upperChar = upper[i];
      const prevUpperChar = upper[i - 1];
      const lowerChar = lower[i];
      const prevLowerChar = lower[i - 1];
      if (underscoreBeforeDigits && isDigit(char) && !isDigit(prevChar)) {
        out += "_" + char;
        continue;
      }
      if (char === upperChar && upperChar !== lowerChar) {
        const prevCharacterIsUppercase = prevChar === prevUpperChar && prevUpperChar !== prevLowerChar;
        if (underscoreBetweenUppercaseLetters || !prevCharacterIsUppercase) {
          out += "_" + lowerChar;
        } else {
          out += lowerChar;
        }
      } else {
        out += char;
      }
    }
    if (upperCase) {
      return out.toUpperCase();
    } else {
      return out;
    }
  });
}
function createCamelCaseMapper({ upperCase = false } = {}) {
  return memoize((str) => {
    if (str.length === 0) {
      return str;
    }
    if (upperCase && isAllUpperCaseSnakeCase(str)) {
      str = str.toLowerCase();
    }
    let out = str[0];
    for (let i = 1, l = str.length; i < l; ++i) {
      const char = str[i];
      const prevChar = str[i - 1];
      if (char !== "_") {
        if (prevChar === "_") {
          out += char.toUpperCase();
        } else {
          out += char;
        }
      }
    }
    return out;
  });
}
function isAllUpperCaseSnakeCase(str) {
  for (let i = 1, l = str.length; i < l; ++i) {
    const char = str[i];
    if (char !== "_" && char !== char.toUpperCase()) {
      return false;
    }
  }
  return true;
}
function isDigit(char) {
  return char >= "0" && char <= "9";
}
function memoize(func) {
  const cache2 = /* @__PURE__ */ new Map();
  return (str) => {
    let mapped = cache2.get(str);
    if (!mapped) {
      mapped = func(str);
      cache2.set(str, mapped);
    }
    return mapped;
  };
}
var init_camel_case = __esm({
  "node_modules/kysely/dist/esm/plugin/camel-case/camel-case.js"() {
  }
});

// node_modules/kysely/dist/esm/plugin/camel-case/camel-case-plugin.js
function canMap(obj, opt) {
  return isPlainObject3(obj) && !opt?.maintainNestedObjectKeys;
}
var CamelCasePlugin;
var init_camel_case_plugin = __esm({
  "node_modules/kysely/dist/esm/plugin/camel-case/camel-case-plugin.js"() {
    init_object_utils();
    init_camel_case_transformer();
    init_camel_case();
    CamelCasePlugin = class {
      opt;
      #camelCase;
      #snakeCase;
      #snakeCaseTransformer;
      constructor(opt = {}) {
        this.opt = opt;
        this.#camelCase = createCamelCaseMapper(opt);
        this.#snakeCase = createSnakeCaseMapper(opt);
        this.#snakeCaseTransformer = new SnakeCaseTransformer(this.snakeCase.bind(this));
      }
      transformQuery(args) {
        return this.#snakeCaseTransformer.transformNode(args.node);
      }
      async transformResult(args) {
        if (args.result.rows && Array.isArray(args.result.rows)) {
          return {
            ...args.result,
            rows: args.result.rows.map((row) => this.mapRow(row))
          };
        }
        return args.result;
      }
      mapRow(row) {
        return Object.keys(row).reduce((obj, key) => {
          let value = row[key];
          if (Array.isArray(value)) {
            value = value.map((it) => canMap(it, this.opt) ? this.mapRow(it) : it);
          } else if (canMap(value, this.opt)) {
            value = this.mapRow(value);
          }
          obj[this.camelCase(key)] = value;
          return obj;
        }, {});
      }
      snakeCase(str) {
        return this.#snakeCase(str);
      }
      camelCase(str) {
        return this.#camelCase(str);
      }
    };
  }
});

// node_modules/kysely/dist/esm/plugin/deduplicate-joins/deduplicate-joins-plugin.js
var init_deduplicate_joins_plugin = __esm({
  "node_modules/kysely/dist/esm/plugin/deduplicate-joins/deduplicate-joins-plugin.js"() {
  }
});

// node_modules/kysely/dist/esm/plugin/parse-json-results/parse-json-results-plugin.js
var init_parse_json_results_plugin = __esm({
  "node_modules/kysely/dist/esm/plugin/parse-json-results/parse-json-results-plugin.js"() {
  }
});

// node_modules/kysely/dist/esm/operation-node/constraint-node.js
var init_constraint_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/constraint-node.js"() {
  }
});

// node_modules/kysely/dist/esm/operation-node/list-node.js
var ListNode;
var init_list_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/list-node.js"() {
    init_object_utils();
    ListNode = freeze({
      is(node) {
        return node.kind === "ListNode";
      },
      create(items) {
        return freeze({
          kind: "ListNode",
          items: freeze(items)
        });
      }
    });
  }
});

// node_modules/kysely/dist/esm/operation-node/operation-node.js
var init_operation_node = __esm({
  "node_modules/kysely/dist/esm/operation-node/operation-node.js"() {
  }
});

// node_modules/kysely/dist/esm/util/column-type.js
var init_column_type = __esm({
  "node_modules/kysely/dist/esm/util/column-type.js"() {
  }
});

// node_modules/kysely/dist/esm/util/explainable.js
var init_explainable = __esm({
  "node_modules/kysely/dist/esm/util/explainable.js"() {
  }
});

// node_modules/kysely/dist/esm/util/streamable.js
var init_streamable = __esm({
  "node_modules/kysely/dist/esm/util/streamable.js"() {
  }
});

// node_modules/kysely/dist/esm/util/infer-result.js
var init_infer_result = __esm({
  "node_modules/kysely/dist/esm/util/infer-result.js"() {
  }
});

// node_modules/kysely/dist/esm/index.js
var init_esm = __esm({
  "node_modules/kysely/dist/esm/index.js"() {
    init_kysely();
    init_query_creator();
    init_expression();
    init_expression_wrapper();
    init_where_interface();
    init_returning_interface();
    init_having_interface();
    init_select_query_builder();
    init_insert_query_builder();
    init_update_query_builder();
    init_delete_query_builder();
    init_no_result_error();
    init_join_builder();
    init_function_module();
    init_insert_result();
    init_delete_result();
    init_update_result();
    init_on_conflict_builder();
    init_aggregate_function_builder();
    init_case_builder();
    init_json_path_builder();
    init_raw_builder();
    init_sql();
    init_query_executor();
    init_default_query_executor();
    init_noop_query_executor();
    init_query_executor_provider();
    init_default_query_compiler();
    init_compiled_query();
    init_schema();
    init_create_table_builder();
    init_create_type_builder();
    init_drop_table_builder();
    init_drop_type_builder();
    init_create_index_builder();
    init_drop_index_builder();
    init_create_schema_builder();
    init_drop_schema_builder();
    init_column_definition_builder();
    init_foreign_key_constraint_builder();
    init_alter_table_builder();
    init_create_view_builder();
    init_drop_view_builder();
    init_alter_column_builder();
    init_dynamic();
    init_driver();
    init_database_connection();
    init_connection_provider();
    init_default_connection_provider();
    init_single_connection_provider();
    init_dummy_driver();
    init_dialect();
    init_dialect_adapter();
    init_dialect_adapter_base();
    init_database_introspector();
    init_sqlite_dialect();
    init_sqlite_dialect_config();
    init_sqlite_driver();
    init_postgres_query_compiler();
    init_postgres_introspector();
    init_postgres_adapter();
    init_mysql_dialect();
    init_mysql_dialect_config();
    init_mysql_driver();
    init_mysql_query_compiler();
    init_mysql_introspector();
    init_mysql_adapter();
    init_postgres_driver();
    init_postgres_dialect_config();
    init_postgres_dialect();
    init_sqlite_query_compiler();
    init_sqlite_introspector();
    init_sqlite_adapter();
    init_default_query_compiler();
    init_query_compiler();
    init_migrator();
    init_file_migration_provider();
    init_kysely_plugin();
    init_camel_case_plugin();
    init_deduplicate_joins_plugin();
    init_with_schema_plugin();
    init_parse_json_results_plugin();
    init_add_column_node();
    init_add_constraint_node();
    init_alias_node();
    init_alter_column_node();
    init_alter_table_node();
    init_and_node();
    init_case_node();
    init_check_constraint_node();
    init_column_definition_node();
    init_column_node();
    init_column_update_node();
    init_common_table_expression_node();
    init_common_table_expression_name_node();
    init_constraint_node();
    init_create_index_node();
    init_create_schema_node();
    init_create_table_node();
    init_create_type_node();
    init_create_view_node();
    init_data_type_node();
    init_default_value_node();
    init_delete_query_node();
    init_drop_column_node();
    init_drop_constraint_node();
    init_drop_index_node();
    init_drop_schema_node();
    init_drop_table_node();
    init_drop_type_node();
    init_drop_view_node();
    init_foreign_key_constraint_node();
    init_from_node();
    init_generated_node();
    init_group_by_item_node();
    init_group_by_node();
    init_having_node();
    init_identifier_node();
    init_insert_query_node();
    init_join_node();
    init_limit_node();
    init_list_node();
    init_modify_column_node();
    init_offset_node();
    init_on_conflict_node();
    init_on_duplicate_key_node();
    init_on_node();
    init_operation_node_source();
    init_operation_node_transformer();
    init_operation_node_visitor();
    init_operation_node();
    init_operator_node();
    init_or_node();
    init_order_by_item_node();
    init_order_by_node();
    init_parens_node();
    init_primary_constraint_node();
    init_primitive_value_list_node();
    init_query_node();
    init_raw_node();
    init_reference_node();
    init_references_node();
    init_rename_column_node();
    init_returning_node();
    init_select_all_node();
    init_select_query_node();
    init_select_query_node();
    init_selection_node();
    init_table_node();
    init_unique_constraint_node();
    init_update_query_node();
    init_value_list_node();
    init_value_node();
    init_values_node();
    init_when_node();
    init_where_node();
    init_with_node();
    init_explain_node();
    init_default_insert_value_node();
    init_aggregate_function_node();
    init_over_node();
    init_partition_by_node();
    init_partition_by_item_node();
    init_set_operation_node();
    init_binary_operation_node();
    init_unary_operation_node();
    init_using_node();
    init_json_reference_node();
    init_json_path_leg_node();
    init_json_path_node();
    init_json_operator_chain_node();
    init_tuple_node();
    init_column_type();
    init_compilable();
    init_explainable();
    init_streamable();
    init_log();
    init_infer_result();
  }
});

// node_modules/kysely-postgres-js/dist/index.js
function freeze2(obj) {
  return Object.freeze(obj);
}
function isPostgresJSSql(thing) {
  return typeof thing === "function" && "reserve" in thing;
}
var RELEASE_CONNECTION_SYMBOL, PostgresJSDriver, PostgresJSConnection, PostgresJSDialectError, PostgresJSDialect;
var init_dist4 = __esm({
  "node_modules/kysely-postgres-js/dist/index.js"() {
    init_esm();
    init_esm();
    RELEASE_CONNECTION_SYMBOL = /* @__PURE__ */ Symbol("release");
    PostgresJSDriver = class extends PostgresDriver {
      #config;
      #postgres;
      constructor(config) {
        super({});
        this.#config = freeze2({ ...config });
      }
      async acquireConnection() {
        const reservedConnection = await this.#postgres.reserve();
        const connection = new PostgresJSConnection(reservedConnection);
        await this.#config.onReserveConnection?.(connection);
        return connection;
      }
      async destroy() {
        await this.#postgres.end();
      }
      async init() {
        const { postgres: postgres2 } = this.#config;
        this.#postgres = isPostgresJSSql(postgres2) ? postgres2 : await postgres2();
      }
      async releaseConnection(connection) {
        ;
        connection[RELEASE_CONNECTION_SYMBOL]();
      }
    };
    PostgresJSConnection = class {
      #reservedConnection;
      constructor(reservedConnection) {
        this.#reservedConnection = reservedConnection;
      }
      async executeQuery(compiledQuery) {
        const result = await this.#reservedConnection.unsafe(compiledQuery.sql, [
          ...compiledQuery.parameters
        ]);
        const { command, count } = result;
        return {
          numAffectedRows: command === "INSERT" || command === "UPDATE" || command === "DELETE" || command === "MERGE" ? BigInt(count) : void 0,
          rows: Array.from(result.values())
        };
      }
      async *streamQuery(compiledQuery, chunkSize) {
        if (!Number.isInteger(chunkSize) || chunkSize <= 0) {
          throw new PostgresJSDialectError("chunkSize must be a positive integer");
        }
        const query = this.#reservedConnection.unsafe(compiledQuery.sql, [
          ...compiledQuery.parameters
        ]);
        if (typeof query.cursor !== "function") {
          throw new Error(
            "PostgresJSDialect detected the instance you passed to it does not support streaming."
          );
        }
        const cursor = query.cursor(chunkSize);
        for await (const rows of cursor) {
          yield { rows };
        }
      }
      [RELEASE_CONNECTION_SYMBOL]() {
        this.#reservedConnection.release();
      }
    };
    PostgresJSDialectError = class extends Error {
      constructor(message2) {
        super(message2);
        this.name = "PostgresJSDialectError";
      }
    };
    PostgresJSDialect = class {
      #config;
      constructor(config) {
        this.#config = freeze2({ ...config });
      }
      createAdapter() {
        return new PostgresAdapter();
      }
      createDriver() {
        return new PostgresJSDriver(this.#config);
      }
      // biome-ignore lint/suspicious/noExplicitAny: this is fine.
      createIntrospector(db2) {
        return new PostgresIntrospector(db2);
      }
      createQueryCompiler() {
        return new PostgresQueryCompiler();
      }
    };
  }
});

// helpers/db.tsx
import postgres from "postgres";
function createDb() {
  if (!dbUrl || dbUrl === "... fill this up ...") {
    return new Proxy({}, {
      get() {
        return () => {
          throw missingDbError;
        };
      }
    });
  }
  return new Kysely({
    plugins: [new CamelCasePlugin()],
    dialect: new PostgresJSDialect({
      postgres: postgres(dbUrl, {
        prepare: false,
        idle_timeout: 10,
        max: 3
      })
    })
  });
}
var dbUrl, missingDbError, db;
var init_db = __esm({
  "helpers/db.tsx"() {
    "use strict";
    init_esm();
    init_dist4();
    dbUrl = process.env.FLOOT_DATABASE_URL;
    missingDbError = new Error(
      "FLOOT_DATABASE_URL environment variable is not configured. Set your PostgreSQL connection string in Vercel env vars."
    );
    db = createDb();
  }
});

// node_modules/jose/dist/webapi/lib/buffer_utils.js
function concat(...buffers) {
  const size = buffers.reduce((acc, { length }) => acc + length, 0);
  const buf = new Uint8Array(size);
  let i = 0;
  for (const buffer of buffers) {
    buf.set(buffer, i);
    i += buffer.length;
  }
  return buf;
}
function encode(string) {
  const bytes = new Uint8Array(string.length);
  for (let i = 0; i < string.length; i++) {
    const code = string.charCodeAt(i);
    if (code > 127) {
      throw new TypeError("non-ASCII string encountered in encode()");
    }
    bytes[i] = code;
  }
  return bytes;
}
var encoder, decoder, MAX_INT32;
var init_buffer_utils = __esm({
  "node_modules/jose/dist/webapi/lib/buffer_utils.js"() {
    encoder = new TextEncoder();
    decoder = new TextDecoder();
    MAX_INT32 = 2 ** 32;
  }
});

// node_modules/jose/dist/webapi/lib/base64.js
function encodeBase64(input) {
  if (Uint8Array.prototype.toBase64) {
    return input.toBase64();
  }
  const CHUNK_SIZE = 32768;
  const arr = [];
  for (let i = 0; i < input.length; i += CHUNK_SIZE) {
    arr.push(String.fromCharCode.apply(null, input.subarray(i, i + CHUNK_SIZE)));
  }
  return btoa(arr.join(""));
}
function decodeBase64(encoded) {
  if (Uint8Array.fromBase64) {
    return Uint8Array.fromBase64(encoded);
  }
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
var init_base64 = __esm({
  "node_modules/jose/dist/webapi/lib/base64.js"() {
  }
});

// node_modules/jose/dist/webapi/util/base64url.js
function decode(input) {
  if (Uint8Array.fromBase64) {
    return Uint8Array.fromBase64(typeof input === "string" ? input : decoder.decode(input), {
      alphabet: "base64url"
    });
  }
  let encoded = input;
  if (encoded instanceof Uint8Array) {
    encoded = decoder.decode(encoded);
  }
  encoded = encoded.replace(/-/g, "+").replace(/_/g, "/");
  try {
    return decodeBase64(encoded);
  } catch {
    throw new TypeError("The input to be decoded is not correctly encoded.");
  }
}
function encode2(input) {
  let unencoded = input;
  if (typeof unencoded === "string") {
    unencoded = encoder.encode(unencoded);
  }
  if (Uint8Array.prototype.toBase64) {
    return unencoded.toBase64({ alphabet: "base64url", omitPadding: true });
  }
  return encodeBase64(unencoded).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
var init_base64url = __esm({
  "node_modules/jose/dist/webapi/util/base64url.js"() {
    init_buffer_utils();
    init_base64();
  }
});

// node_modules/jose/dist/webapi/lib/crypto_key.js
function getHashLength(hash2) {
  return parseInt(hash2.name.slice(4), 10);
}
function checkHashLength(algorithm, expected) {
  const actual = getHashLength(algorithm.hash);
  if (actual !== expected)
    throw unusable(`SHA-${expected}`, "algorithm.hash");
}
function getNamedCurve(alg) {
  switch (alg) {
    case "ES256":
      return "P-256";
    case "ES384":
      return "P-384";
    case "ES512":
      return "P-521";
    default:
      throw new Error("unreachable");
  }
}
function checkUsage(key, usage) {
  if (usage && !key.usages.includes(usage)) {
    throw new TypeError(`CryptoKey does not support this operation, its usages must include ${usage}.`);
  }
}
function checkSigCryptoKey(key, alg, usage) {
  switch (alg) {
    case "HS256":
    case "HS384":
    case "HS512": {
      if (!isAlgorithm(key.algorithm, "HMAC"))
        throw unusable("HMAC");
      checkHashLength(key.algorithm, parseInt(alg.slice(2), 10));
      break;
    }
    case "RS256":
    case "RS384":
    case "RS512": {
      if (!isAlgorithm(key.algorithm, "RSASSA-PKCS1-v1_5"))
        throw unusable("RSASSA-PKCS1-v1_5");
      checkHashLength(key.algorithm, parseInt(alg.slice(2), 10));
      break;
    }
    case "PS256":
    case "PS384":
    case "PS512": {
      if (!isAlgorithm(key.algorithm, "RSA-PSS"))
        throw unusable("RSA-PSS");
      checkHashLength(key.algorithm, parseInt(alg.slice(2), 10));
      break;
    }
    case "Ed25519":
    case "EdDSA": {
      if (!isAlgorithm(key.algorithm, "Ed25519"))
        throw unusable("Ed25519");
      break;
    }
    case "ML-DSA-44":
    case "ML-DSA-65":
    case "ML-DSA-87": {
      if (!isAlgorithm(key.algorithm, alg))
        throw unusable(alg);
      break;
    }
    case "ES256":
    case "ES384":
    case "ES512": {
      if (!isAlgorithm(key.algorithm, "ECDSA"))
        throw unusable("ECDSA");
      const expected = getNamedCurve(alg);
      const actual = key.algorithm.namedCurve;
      if (actual !== expected)
        throw unusable(expected, "algorithm.namedCurve");
      break;
    }
    default:
      throw new TypeError("CryptoKey does not support this operation");
  }
  checkUsage(key, usage);
}
var unusable, isAlgorithm;
var init_crypto_key = __esm({
  "node_modules/jose/dist/webapi/lib/crypto_key.js"() {
    unusable = (name, prop = "algorithm.name") => new TypeError(`CryptoKey does not support this operation, its ${prop} must be ${name}`);
    isAlgorithm = (algorithm, name) => algorithm.name === name;
  }
});

// node_modules/jose/dist/webapi/lib/invalid_key_input.js
function message(msg, actual, ...types) {
  types = types.filter(Boolean);
  if (types.length > 2) {
    const last = types.pop();
    msg += `one of type ${types.join(", ")}, or ${last}.`;
  } else if (types.length === 2) {
    msg += `one of type ${types[0]} or ${types[1]}.`;
  } else {
    msg += `of type ${types[0]}.`;
  }
  if (actual == null) {
    msg += ` Received ${actual}`;
  } else if (typeof actual === "function" && actual.name) {
    msg += ` Received function ${actual.name}`;
  } else if (typeof actual === "object" && actual != null) {
    if (actual.constructor?.name) {
      msg += ` Received an instance of ${actual.constructor.name}`;
    }
  }
  return msg;
}
var invalidKeyInput, withAlg;
var init_invalid_key_input = __esm({
  "node_modules/jose/dist/webapi/lib/invalid_key_input.js"() {
    invalidKeyInput = (actual, ...types) => message("Key must be ", actual, ...types);
    withAlg = (alg, actual, ...types) => message(`Key for the ${alg} algorithm must be `, actual, ...types);
  }
});

// node_modules/jose/dist/webapi/util/errors.js
var JOSEError, JWTClaimValidationFailed, JWTExpired, JOSEAlgNotAllowed, JOSENotSupported, JWSInvalid, JWTInvalid, JWSSignatureVerificationFailed;
var init_errors = __esm({
  "node_modules/jose/dist/webapi/util/errors.js"() {
    JOSEError = class extends Error {
      static code = "ERR_JOSE_GENERIC";
      code = "ERR_JOSE_GENERIC";
      constructor(message2, options) {
        super(message2, options);
        this.name = this.constructor.name;
        Error.captureStackTrace?.(this, this.constructor);
      }
    };
    JWTClaimValidationFailed = class extends JOSEError {
      static code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
      code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
      claim;
      reason;
      payload;
      constructor(message2, payload, claim = "unspecified", reason = "unspecified") {
        super(message2, { cause: { claim, reason, payload } });
        this.claim = claim;
        this.reason = reason;
        this.payload = payload;
      }
    };
    JWTExpired = class extends JOSEError {
      static code = "ERR_JWT_EXPIRED";
      code = "ERR_JWT_EXPIRED";
      claim;
      reason;
      payload;
      constructor(message2, payload, claim = "unspecified", reason = "unspecified") {
        super(message2, { cause: { claim, reason, payload } });
        this.claim = claim;
        this.reason = reason;
        this.payload = payload;
      }
    };
    JOSEAlgNotAllowed = class extends JOSEError {
      static code = "ERR_JOSE_ALG_NOT_ALLOWED";
      code = "ERR_JOSE_ALG_NOT_ALLOWED";
    };
    JOSENotSupported = class extends JOSEError {
      static code = "ERR_JOSE_NOT_SUPPORTED";
      code = "ERR_JOSE_NOT_SUPPORTED";
    };
    JWSInvalid = class extends JOSEError {
      static code = "ERR_JWS_INVALID";
      code = "ERR_JWS_INVALID";
    };
    JWTInvalid = class extends JOSEError {
      static code = "ERR_JWT_INVALID";
      code = "ERR_JWT_INVALID";
    };
    JWSSignatureVerificationFailed = class extends JOSEError {
      static code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
      code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
      constructor(message2 = "signature verification failed", options) {
        super(message2, options);
      }
    };
  }
});

// node_modules/jose/dist/webapi/lib/is_key_like.js
var isCryptoKey, isKeyObject, isKeyLike;
var init_is_key_like = __esm({
  "node_modules/jose/dist/webapi/lib/is_key_like.js"() {
    isCryptoKey = (key) => {
      if (key?.[Symbol.toStringTag] === "CryptoKey")
        return true;
      try {
        return key instanceof CryptoKey;
      } catch {
        return false;
      }
    };
    isKeyObject = (key) => key?.[Symbol.toStringTag] === "KeyObject";
    isKeyLike = (key) => isCryptoKey(key) || isKeyObject(key);
  }
});

// node_modules/jose/dist/webapi/lib/helpers.js
function assertNotSet(value, name) {
  if (value) {
    throw new TypeError(`${name} can only be called once`);
  }
}
function decodeBase64url(value, label, ErrorClass) {
  try {
    return decode(value);
  } catch {
    throw new ErrorClass(`Failed to base64url decode the ${label}`);
  }
}
var init_helpers = __esm({
  "node_modules/jose/dist/webapi/lib/helpers.js"() {
    init_base64url();
  }
});

// node_modules/jose/dist/webapi/lib/type_checks.js
function isObject2(input) {
  if (!isObjectLike(input) || Object.prototype.toString.call(input) !== "[object Object]") {
    return false;
  }
  if (Object.getPrototypeOf(input) === null) {
    return true;
  }
  let proto = input;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(input) === proto;
}
function isDisjoint(...headers) {
  const sources = headers.filter(Boolean);
  if (sources.length === 0 || sources.length === 1) {
    return true;
  }
  let acc;
  for (const header of sources) {
    const parameters = Object.keys(header);
    if (!acc || acc.size === 0) {
      acc = new Set(parameters);
      continue;
    }
    for (const parameter of parameters) {
      if (acc.has(parameter)) {
        return false;
      }
      acc.add(parameter);
    }
  }
  return true;
}
var isObjectLike, isJWK, isPrivateJWK, isPublicJWK, isSecretJWK;
var init_type_checks = __esm({
  "node_modules/jose/dist/webapi/lib/type_checks.js"() {
    isObjectLike = (value) => typeof value === "object" && value !== null;
    isJWK = (key) => isObject2(key) && typeof key.kty === "string";
    isPrivateJWK = (key) => key.kty !== "oct" && (key.kty === "AKP" && typeof key.priv === "string" || typeof key.d === "string");
    isPublicJWK = (key) => key.kty !== "oct" && key.d === void 0 && key.priv === void 0;
    isSecretJWK = (key) => key.kty === "oct" && typeof key.k === "string";
  }
});

// node_modules/jose/dist/webapi/lib/signing.js
function checkKeyLength(alg, key) {
  if (alg.startsWith("RS") || alg.startsWith("PS")) {
    const { modulusLength } = key.algorithm;
    if (typeof modulusLength !== "number" || modulusLength < 2048) {
      throw new TypeError(`${alg} requires key modulusLength to be 2048 bits or larger`);
    }
  }
}
function subtleAlgorithm(alg, algorithm) {
  const hash2 = `SHA-${alg.slice(-3)}`;
  switch (alg) {
    case "HS256":
    case "HS384":
    case "HS512":
      return { hash: hash2, name: "HMAC" };
    case "PS256":
    case "PS384":
    case "PS512":
      return { hash: hash2, name: "RSA-PSS", saltLength: parseInt(alg.slice(-3), 10) >> 3 };
    case "RS256":
    case "RS384":
    case "RS512":
      return { hash: hash2, name: "RSASSA-PKCS1-v1_5" };
    case "ES256":
    case "ES384":
    case "ES512":
      return { hash: hash2, name: "ECDSA", namedCurve: algorithm.namedCurve };
    case "Ed25519":
    case "EdDSA":
      return { name: "Ed25519" };
    case "ML-DSA-44":
    case "ML-DSA-65":
    case "ML-DSA-87":
      return { name: alg };
    default:
      throw new JOSENotSupported(`alg ${alg} is not supported either by JOSE or your javascript runtime`);
  }
}
async function getSigKey(alg, key, usage) {
  if (key instanceof Uint8Array) {
    if (!alg.startsWith("HS")) {
      throw new TypeError(invalidKeyInput(key, "CryptoKey", "KeyObject", "JSON Web Key"));
    }
    return crypto.subtle.importKey("raw", key, { hash: `SHA-${alg.slice(-3)}`, name: "HMAC" }, false, [usage]);
  }
  checkSigCryptoKey(key, alg, usage);
  return key;
}
async function sign(alg, key, data) {
  const cryptoKey = await getSigKey(alg, key, "sign");
  checkKeyLength(alg, cryptoKey);
  const signature = await crypto.subtle.sign(subtleAlgorithm(alg, cryptoKey.algorithm), cryptoKey, data);
  return new Uint8Array(signature);
}
async function verify(alg, key, signature, data) {
  const cryptoKey = await getSigKey(alg, key, "verify");
  checkKeyLength(alg, cryptoKey);
  const algorithm = subtleAlgorithm(alg, cryptoKey.algorithm);
  try {
    return await crypto.subtle.verify(algorithm, cryptoKey, signature, data);
  } catch {
    return false;
  }
}
var init_signing = __esm({
  "node_modules/jose/dist/webapi/lib/signing.js"() {
    init_errors();
    init_crypto_key();
    init_invalid_key_input();
  }
});

// node_modules/jose/dist/webapi/lib/jwk_to_key.js
function subtleMapping(jwk) {
  let algorithm;
  let keyUsages;
  switch (jwk.kty) {
    case "AKP": {
      switch (jwk.alg) {
        case "ML-DSA-44":
        case "ML-DSA-65":
        case "ML-DSA-87":
          algorithm = { name: jwk.alg };
          keyUsages = jwk.priv ? ["sign"] : ["verify"];
          break;
        default:
          throw new JOSENotSupported(unsupportedAlg);
      }
      break;
    }
    case "RSA": {
      switch (jwk.alg) {
        case "PS256":
        case "PS384":
        case "PS512":
          algorithm = { name: "RSA-PSS", hash: `SHA-${jwk.alg.slice(-3)}` };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "RS256":
        case "RS384":
        case "RS512":
          algorithm = { name: "RSASSA-PKCS1-v1_5", hash: `SHA-${jwk.alg.slice(-3)}` };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "RSA-OAEP":
        case "RSA-OAEP-256":
        case "RSA-OAEP-384":
        case "RSA-OAEP-512":
          algorithm = {
            name: "RSA-OAEP",
            hash: `SHA-${parseInt(jwk.alg.slice(-3), 10) || 1}`
          };
          keyUsages = jwk.d ? ["decrypt", "unwrapKey"] : ["encrypt", "wrapKey"];
          break;
        default:
          throw new JOSENotSupported(unsupportedAlg);
      }
      break;
    }
    case "EC": {
      switch (jwk.alg) {
        case "ES256":
        case "ES384":
        case "ES512":
          algorithm = {
            name: "ECDSA",
            namedCurve: { ES256: "P-256", ES384: "P-384", ES512: "P-521" }[jwk.alg]
          };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "ECDH-ES":
        case "ECDH-ES+A128KW":
        case "ECDH-ES+A192KW":
        case "ECDH-ES+A256KW":
          algorithm = { name: "ECDH", namedCurve: jwk.crv };
          keyUsages = jwk.d ? ["deriveBits"] : [];
          break;
        default:
          throw new JOSENotSupported(unsupportedAlg);
      }
      break;
    }
    case "OKP": {
      switch (jwk.alg) {
        case "Ed25519":
        case "EdDSA":
          algorithm = { name: "Ed25519" };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "ECDH-ES":
        case "ECDH-ES+A128KW":
        case "ECDH-ES+A192KW":
        case "ECDH-ES+A256KW":
          algorithm = { name: jwk.crv };
          keyUsages = jwk.d ? ["deriveBits"] : [];
          break;
        default:
          throw new JOSENotSupported(unsupportedAlg);
      }
      break;
    }
    default:
      throw new JOSENotSupported('Invalid or unsupported JWK "kty" (Key Type) Parameter value');
  }
  return { algorithm, keyUsages };
}
async function jwkToKey(jwk) {
  if (!jwk.alg) {
    throw new TypeError('"alg" argument is required when "jwk.alg" is not present');
  }
  const { algorithm, keyUsages } = subtleMapping(jwk);
  const keyData = { ...jwk };
  if (keyData.kty !== "AKP") {
    delete keyData.alg;
  }
  delete keyData.use;
  return crypto.subtle.importKey("jwk", keyData, algorithm, jwk.ext ?? (jwk.d || jwk.priv ? false : true), jwk.key_ops ?? keyUsages);
}
var unsupportedAlg;
var init_jwk_to_key = __esm({
  "node_modules/jose/dist/webapi/lib/jwk_to_key.js"() {
    init_errors();
    unsupportedAlg = 'Invalid or unsupported JWK "alg" (Algorithm) Parameter value';
  }
});

// node_modules/jose/dist/webapi/lib/normalize_key.js
async function normalizeKey(key, alg) {
  if (key instanceof Uint8Array) {
    return key;
  }
  if (isCryptoKey(key)) {
    return key;
  }
  if (isKeyObject(key)) {
    if (key.type === "secret") {
      return key.export();
    }
    if ("toCryptoKey" in key && typeof key.toCryptoKey === "function") {
      try {
        return handleKeyObject(key, alg);
      } catch (err) {
        if (err instanceof TypeError) {
          throw err;
        }
      }
    }
    let jwk = key.export({ format: "jwk" });
    return handleJWK(key, jwk, alg);
  }
  if (isJWK(key)) {
    if (key.k) {
      return decode(key.k);
    }
    return handleJWK(key, key, alg, true);
  }
  throw new Error("unreachable");
}
var unusableForAlg, cache, handleJWK, handleKeyObject;
var init_normalize_key = __esm({
  "node_modules/jose/dist/webapi/lib/normalize_key.js"() {
    init_type_checks();
    init_base64url();
    init_jwk_to_key();
    init_is_key_like();
    unusableForAlg = "given KeyObject instance cannot be used for this algorithm";
    handleJWK = async (key, jwk, alg, freeze3 = false) => {
      cache ||= /* @__PURE__ */ new WeakMap();
      let cached = cache.get(key);
      if (cached?.[alg]) {
        return cached[alg];
      }
      const cryptoKey = await jwkToKey({ ...jwk, alg });
      if (freeze3)
        Object.freeze(key);
      if (!cached) {
        cache.set(key, { [alg]: cryptoKey });
      } else {
        cached[alg] = cryptoKey;
      }
      return cryptoKey;
    };
    handleKeyObject = (keyObject, alg) => {
      cache ||= /* @__PURE__ */ new WeakMap();
      let cached = cache.get(keyObject);
      if (cached?.[alg]) {
        return cached[alg];
      }
      const isPublic = keyObject.type === "public";
      const extractable = isPublic ? true : false;
      let cryptoKey;
      if (keyObject.asymmetricKeyType === "x25519") {
        switch (alg) {
          case "ECDH-ES":
          case "ECDH-ES+A128KW":
          case "ECDH-ES+A192KW":
          case "ECDH-ES+A256KW":
            break;
          default:
            throw new TypeError(unusableForAlg);
        }
        cryptoKey = keyObject.toCryptoKey(keyObject.asymmetricKeyType, extractable, isPublic ? [] : ["deriveBits"]);
      }
      if (keyObject.asymmetricKeyType === "ed25519") {
        if (alg !== "EdDSA" && alg !== "Ed25519") {
          throw new TypeError(unusableForAlg);
        }
        cryptoKey = keyObject.toCryptoKey(keyObject.asymmetricKeyType, extractable, [
          isPublic ? "verify" : "sign"
        ]);
      }
      switch (keyObject.asymmetricKeyType) {
        case "ml-dsa-44":
        case "ml-dsa-65":
        case "ml-dsa-87": {
          if (alg !== keyObject.asymmetricKeyType.toUpperCase()) {
            throw new TypeError(unusableForAlg);
          }
          cryptoKey = keyObject.toCryptoKey(keyObject.asymmetricKeyType, extractable, [
            isPublic ? "verify" : "sign"
          ]);
        }
      }
      if (keyObject.asymmetricKeyType === "rsa") {
        let hash2;
        switch (alg) {
          case "RSA-OAEP":
            hash2 = "SHA-1";
            break;
          case "RS256":
          case "PS256":
          case "RSA-OAEP-256":
            hash2 = "SHA-256";
            break;
          case "RS384":
          case "PS384":
          case "RSA-OAEP-384":
            hash2 = "SHA-384";
            break;
          case "RS512":
          case "PS512":
          case "RSA-OAEP-512":
            hash2 = "SHA-512";
            break;
          default:
            throw new TypeError(unusableForAlg);
        }
        if (alg.startsWith("RSA-OAEP")) {
          return keyObject.toCryptoKey({
            name: "RSA-OAEP",
            hash: hash2
          }, extractable, isPublic ? ["encrypt"] : ["decrypt"]);
        }
        cryptoKey = keyObject.toCryptoKey({
          name: alg.startsWith("PS") ? "RSA-PSS" : "RSASSA-PKCS1-v1_5",
          hash: hash2
        }, extractable, [isPublic ? "verify" : "sign"]);
      }
      if (keyObject.asymmetricKeyType === "ec") {
        const nist = /* @__PURE__ */ new Map([
          ["prime256v1", "P-256"],
          ["secp384r1", "P-384"],
          ["secp521r1", "P-521"]
        ]);
        const namedCurve = nist.get(keyObject.asymmetricKeyDetails?.namedCurve);
        if (!namedCurve) {
          throw new TypeError(unusableForAlg);
        }
        const expectedCurve = { ES256: "P-256", ES384: "P-384", ES512: "P-521" };
        if (expectedCurve[alg] && namedCurve === expectedCurve[alg]) {
          cryptoKey = keyObject.toCryptoKey({
            name: "ECDSA",
            namedCurve
          }, extractable, [isPublic ? "verify" : "sign"]);
        }
        if (alg.startsWith("ECDH-ES")) {
          cryptoKey = keyObject.toCryptoKey({
            name: "ECDH",
            namedCurve
          }, extractable, isPublic ? [] : ["deriveBits"]);
        }
      }
      if (!cryptoKey) {
        throw new TypeError(unusableForAlg);
      }
      if (!cached) {
        cache.set(keyObject, { [alg]: cryptoKey });
      } else {
        cached[alg] = cryptoKey;
      }
      return cryptoKey;
    };
  }
});

// node_modules/jose/dist/webapi/lib/validate_crit.js
function validateCrit(Err, recognizedDefault, recognizedOption, protectedHeader, joseHeader) {
  if (joseHeader.crit !== void 0 && protectedHeader?.crit === void 0) {
    throw new Err('"crit" (Critical) Header Parameter MUST be integrity protected');
  }
  if (!protectedHeader || protectedHeader.crit === void 0) {
    return /* @__PURE__ */ new Set();
  }
  if (!Array.isArray(protectedHeader.crit) || protectedHeader.crit.length === 0 || protectedHeader.crit.some((input) => typeof input !== "string" || input.length === 0)) {
    throw new Err('"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present');
  }
  let recognized;
  if (recognizedOption !== void 0) {
    recognized = new Map([...Object.entries(recognizedOption), ...recognizedDefault.entries()]);
  } else {
    recognized = recognizedDefault;
  }
  for (const parameter of protectedHeader.crit) {
    if (!recognized.has(parameter)) {
      throw new JOSENotSupported(`Extension Header Parameter "${parameter}" is not recognized`);
    }
    if (joseHeader[parameter] === void 0) {
      throw new Err(`Extension Header Parameter "${parameter}" is missing`);
    }
    if (recognized.get(parameter) && protectedHeader[parameter] === void 0) {
      throw new Err(`Extension Header Parameter "${parameter}" MUST be integrity protected`);
    }
  }
  return new Set(protectedHeader.crit);
}
var init_validate_crit = __esm({
  "node_modules/jose/dist/webapi/lib/validate_crit.js"() {
    init_errors();
  }
});

// node_modules/jose/dist/webapi/lib/validate_algorithms.js
function validateAlgorithms(option, algorithms) {
  if (algorithms !== void 0 && (!Array.isArray(algorithms) || algorithms.some((s) => typeof s !== "string"))) {
    throw new TypeError(`"${option}" option must be an array of strings`);
  }
  if (!algorithms) {
    return void 0;
  }
  return new Set(algorithms);
}
var init_validate_algorithms = __esm({
  "node_modules/jose/dist/webapi/lib/validate_algorithms.js"() {
  }
});

// node_modules/jose/dist/webapi/lib/check_key_type.js
function checkKeyType(alg, key, usage) {
  switch (alg.substring(0, 2)) {
    case "A1":
    case "A2":
    case "di":
    case "HS":
    case "PB":
      symmetricTypeCheck(alg, key, usage);
      break;
    default:
      asymmetricTypeCheck(alg, key, usage);
  }
}
var tag, jwkMatchesOp, symmetricTypeCheck, asymmetricTypeCheck;
var init_check_key_type = __esm({
  "node_modules/jose/dist/webapi/lib/check_key_type.js"() {
    init_invalid_key_input();
    init_is_key_like();
    init_type_checks();
    tag = (key) => key?.[Symbol.toStringTag];
    jwkMatchesOp = (alg, key, usage) => {
      if (key.use !== void 0) {
        let expected;
        switch (usage) {
          case "sign":
          case "verify":
            expected = "sig";
            break;
          case "encrypt":
          case "decrypt":
            expected = "enc";
            break;
        }
        if (key.use !== expected) {
          throw new TypeError(`Invalid key for this operation, its "use" must be "${expected}" when present`);
        }
      }
      if (key.alg !== void 0 && key.alg !== alg) {
        throw new TypeError(`Invalid key for this operation, its "alg" must be "${alg}" when present`);
      }
      if (Array.isArray(key.key_ops)) {
        let expectedKeyOp;
        switch (true) {
          case (usage === "sign" || usage === "verify"):
          case alg === "dir":
          case alg.includes("CBC-HS"):
            expectedKeyOp = usage;
            break;
          case alg.startsWith("PBES2"):
            expectedKeyOp = "deriveBits";
            break;
          case /^A\d{3}(?:GCM)?(?:KW)?$/.test(alg):
            if (!alg.includes("GCM") && alg.endsWith("KW")) {
              expectedKeyOp = usage === "encrypt" ? "wrapKey" : "unwrapKey";
            } else {
              expectedKeyOp = usage;
            }
            break;
          case (usage === "encrypt" && alg.startsWith("RSA")):
            expectedKeyOp = "wrapKey";
            break;
          case usage === "decrypt":
            expectedKeyOp = alg.startsWith("RSA") ? "unwrapKey" : "deriveBits";
            break;
        }
        if (expectedKeyOp && key.key_ops?.includes?.(expectedKeyOp) === false) {
          throw new TypeError(`Invalid key for this operation, its "key_ops" must include "${expectedKeyOp}" when present`);
        }
      }
      return true;
    };
    symmetricTypeCheck = (alg, key, usage) => {
      if (key instanceof Uint8Array)
        return;
      if (isJWK(key)) {
        if (isSecretJWK(key) && jwkMatchesOp(alg, key, usage))
          return;
        throw new TypeError(`JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present`);
      }
      if (!isKeyLike(key)) {
        throw new TypeError(withAlg(alg, key, "CryptoKey", "KeyObject", "JSON Web Key", "Uint8Array"));
      }
      if (key.type !== "secret") {
        throw new TypeError(`${tag(key)} instances for symmetric algorithms must be of type "secret"`);
      }
    };
    asymmetricTypeCheck = (alg, key, usage) => {
      if (isJWK(key)) {
        switch (usage) {
          case "decrypt":
          case "sign":
            if (isPrivateJWK(key) && jwkMatchesOp(alg, key, usage))
              return;
            throw new TypeError(`JSON Web Key for this operation must be a private JWK`);
          case "encrypt":
          case "verify":
            if (isPublicJWK(key) && jwkMatchesOp(alg, key, usage))
              return;
            throw new TypeError(`JSON Web Key for this operation must be a public JWK`);
        }
      }
      if (!isKeyLike(key)) {
        throw new TypeError(withAlg(alg, key, "CryptoKey", "KeyObject", "JSON Web Key"));
      }
      if (key.type === "secret") {
        throw new TypeError(`${tag(key)} instances for asymmetric algorithms must not be of type "secret"`);
      }
      if (key.type === "public") {
        switch (usage) {
          case "sign":
            throw new TypeError(`${tag(key)} instances for asymmetric algorithm signing must be of type "private"`);
          case "decrypt":
            throw new TypeError(`${tag(key)} instances for asymmetric algorithm decryption must be of type "private"`);
        }
      }
      if (key.type === "private") {
        switch (usage) {
          case "verify":
            throw new TypeError(`${tag(key)} instances for asymmetric algorithm verifying must be of type "public"`);
          case "encrypt":
            throw new TypeError(`${tag(key)} instances for asymmetric algorithm encryption must be of type "public"`);
        }
      }
    };
  }
});

// node_modules/jose/dist/webapi/jws/flattened/verify.js
async function flattenedVerify(jws, key, options) {
  if (!isObject2(jws)) {
    throw new JWSInvalid("Flattened JWS must be an object");
  }
  if (jws.protected === void 0 && jws.header === void 0) {
    throw new JWSInvalid('Flattened JWS must have either of the "protected" or "header" members');
  }
  if (jws.protected !== void 0 && typeof jws.protected !== "string") {
    throw new JWSInvalid("JWS Protected Header incorrect type");
  }
  if (jws.payload === void 0) {
    throw new JWSInvalid("JWS Payload missing");
  }
  if (typeof jws.signature !== "string") {
    throw new JWSInvalid("JWS Signature missing or incorrect type");
  }
  if (jws.header !== void 0 && !isObject2(jws.header)) {
    throw new JWSInvalid("JWS Unprotected Header incorrect type");
  }
  let parsedProt = {};
  if (jws.protected) {
    try {
      const protectedHeader = decode(jws.protected);
      parsedProt = JSON.parse(decoder.decode(protectedHeader));
    } catch {
      throw new JWSInvalid("JWS Protected Header is invalid");
    }
  }
  if (!isDisjoint(parsedProt, jws.header)) {
    throw new JWSInvalid("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
  }
  const joseHeader = {
    ...parsedProt,
    ...jws.header
  };
  const extensions = validateCrit(JWSInvalid, /* @__PURE__ */ new Map([["b64", true]]), options?.crit, parsedProt, joseHeader);
  let b64 = true;
  if (extensions.has("b64")) {
    b64 = parsedProt.b64;
    if (typeof b64 !== "boolean") {
      throw new JWSInvalid('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
    }
  }
  const { alg } = joseHeader;
  if (typeof alg !== "string" || !alg) {
    throw new JWSInvalid('JWS "alg" (Algorithm) Header Parameter missing or invalid');
  }
  const algorithms = options && validateAlgorithms("algorithms", options.algorithms);
  if (algorithms && !algorithms.has(alg)) {
    throw new JOSEAlgNotAllowed('"alg" (Algorithm) Header Parameter value not allowed');
  }
  if (b64) {
    if (typeof jws.payload !== "string") {
      throw new JWSInvalid("JWS Payload must be a string");
    }
  } else if (typeof jws.payload !== "string" && !(jws.payload instanceof Uint8Array)) {
    throw new JWSInvalid("JWS Payload must be a string or an Uint8Array instance");
  }
  let resolvedKey = false;
  if (typeof key === "function") {
    key = await key(parsedProt, jws);
    resolvedKey = true;
  }
  checkKeyType(alg, key, "verify");
  const data = concat(jws.protected !== void 0 ? encode(jws.protected) : new Uint8Array(), encode("."), typeof jws.payload === "string" ? b64 ? encode(jws.payload) : encoder.encode(jws.payload) : jws.payload);
  const signature = decodeBase64url(jws.signature, "signature", JWSInvalid);
  const k = await normalizeKey(key, alg);
  const verified = await verify(alg, k, signature, data);
  if (!verified) {
    throw new JWSSignatureVerificationFailed();
  }
  let payload;
  if (b64) {
    payload = decodeBase64url(jws.payload, "payload", JWSInvalid);
  } else if (typeof jws.payload === "string") {
    payload = encoder.encode(jws.payload);
  } else {
    payload = jws.payload;
  }
  const result = { payload };
  if (jws.protected !== void 0) {
    result.protectedHeader = parsedProt;
  }
  if (jws.header !== void 0) {
    result.unprotectedHeader = jws.header;
  }
  if (resolvedKey) {
    return { ...result, key: k };
  }
  return result;
}
var init_verify = __esm({
  "node_modules/jose/dist/webapi/jws/flattened/verify.js"() {
    init_base64url();
    init_signing();
    init_errors();
    init_buffer_utils();
    init_helpers();
    init_type_checks();
    init_type_checks();
    init_check_key_type();
    init_validate_crit();
    init_validate_algorithms();
    init_normalize_key();
  }
});

// node_modules/jose/dist/webapi/jws/compact/verify.js
async function compactVerify(jws, key, options) {
  if (jws instanceof Uint8Array) {
    jws = decoder.decode(jws);
  }
  if (typeof jws !== "string") {
    throw new JWSInvalid("Compact JWS must be a string or Uint8Array");
  }
  const { 0: protectedHeader, 1: payload, 2: signature, length } = jws.split(".");
  if (length !== 3) {
    throw new JWSInvalid("Invalid Compact JWS");
  }
  const verified = await flattenedVerify({ payload, protected: protectedHeader, signature }, key, options);
  const result = { payload: verified.payload, protectedHeader: verified.protectedHeader };
  if (typeof key === "function") {
    return { ...result, key: verified.key };
  }
  return result;
}
var init_verify2 = __esm({
  "node_modules/jose/dist/webapi/jws/compact/verify.js"() {
    init_verify();
    init_errors();
    init_buffer_utils();
  }
});

// node_modules/jose/dist/webapi/lib/jwt_claims_set.js
function secs(str) {
  const matched = REGEX.exec(str);
  if (!matched || matched[4] && matched[1]) {
    throw new TypeError("Invalid time period format");
  }
  const value = parseFloat(matched[2]);
  const unit = matched[3].toLowerCase();
  let numericDate;
  switch (unit) {
    case "sec":
    case "secs":
    case "second":
    case "seconds":
    case "s":
      numericDate = Math.round(value);
      break;
    case "minute":
    case "minutes":
    case "min":
    case "mins":
    case "m":
      numericDate = Math.round(value * minute);
      break;
    case "hour":
    case "hours":
    case "hr":
    case "hrs":
    case "h":
      numericDate = Math.round(value * hour);
      break;
    case "day":
    case "days":
    case "d":
      numericDate = Math.round(value * day);
      break;
    case "week":
    case "weeks":
    case "w":
      numericDate = Math.round(value * week);
      break;
    default:
      numericDate = Math.round(value * year);
      break;
  }
  if (matched[1] === "-" || matched[4] === "ago") {
    return -numericDate;
  }
  return numericDate;
}
function validateInput(label, input) {
  if (!Number.isFinite(input)) {
    throw new TypeError(`Invalid ${label} input`);
  }
  return input;
}
function validateClaimsSet(protectedHeader, encodedPayload, options = {}) {
  let payload;
  try {
    payload = JSON.parse(decoder.decode(encodedPayload));
  } catch {
  }
  if (!isObject2(payload)) {
    throw new JWTInvalid("JWT Claims Set must be a top-level JSON object");
  }
  const { typ } = options;
  if (typ && (typeof protectedHeader.typ !== "string" || normalizeTyp(protectedHeader.typ) !== normalizeTyp(typ))) {
    throw new JWTClaimValidationFailed('unexpected "typ" JWT header value', payload, "typ", "check_failed");
  }
  const { requiredClaims = [], issuer, subject, audience, maxTokenAge } = options;
  const presenceCheck = [...requiredClaims];
  if (maxTokenAge !== void 0)
    presenceCheck.push("iat");
  if (audience !== void 0)
    presenceCheck.push("aud");
  if (subject !== void 0)
    presenceCheck.push("sub");
  if (issuer !== void 0)
    presenceCheck.push("iss");
  for (const claim of new Set(presenceCheck.reverse())) {
    if (!(claim in payload)) {
      throw new JWTClaimValidationFailed(`missing required "${claim}" claim`, payload, claim, "missing");
    }
  }
  if (issuer && !(Array.isArray(issuer) ? issuer : [issuer]).includes(payload.iss)) {
    throw new JWTClaimValidationFailed('unexpected "iss" claim value', payload, "iss", "check_failed");
  }
  if (subject && payload.sub !== subject) {
    throw new JWTClaimValidationFailed('unexpected "sub" claim value', payload, "sub", "check_failed");
  }
  if (audience && !checkAudiencePresence(payload.aud, typeof audience === "string" ? [audience] : audience)) {
    throw new JWTClaimValidationFailed('unexpected "aud" claim value', payload, "aud", "check_failed");
  }
  let tolerance;
  switch (typeof options.clockTolerance) {
    case "string":
      tolerance = secs(options.clockTolerance);
      break;
    case "number":
      tolerance = options.clockTolerance;
      break;
    case "undefined":
      tolerance = 0;
      break;
    default:
      throw new TypeError("Invalid clockTolerance option type");
  }
  const { currentDate } = options;
  const now = epoch(currentDate || /* @__PURE__ */ new Date());
  if ((payload.iat !== void 0 || maxTokenAge) && typeof payload.iat !== "number") {
    throw new JWTClaimValidationFailed('"iat" claim must be a number', payload, "iat", "invalid");
  }
  if (payload.nbf !== void 0) {
    if (typeof payload.nbf !== "number") {
      throw new JWTClaimValidationFailed('"nbf" claim must be a number', payload, "nbf", "invalid");
    }
    if (payload.nbf > now + tolerance) {
      throw new JWTClaimValidationFailed('"nbf" claim timestamp check failed', payload, "nbf", "check_failed");
    }
  }
  if (payload.exp !== void 0) {
    if (typeof payload.exp !== "number") {
      throw new JWTClaimValidationFailed('"exp" claim must be a number', payload, "exp", "invalid");
    }
    if (payload.exp <= now - tolerance) {
      throw new JWTExpired('"exp" claim timestamp check failed', payload, "exp", "check_failed");
    }
  }
  if (maxTokenAge) {
    const age = now - payload.iat;
    const max = typeof maxTokenAge === "number" ? maxTokenAge : secs(maxTokenAge);
    if (age - tolerance > max) {
      throw new JWTExpired('"iat" claim timestamp check failed (too far in the past)', payload, "iat", "check_failed");
    }
    if (age < 0 - tolerance) {
      throw new JWTClaimValidationFailed('"iat" claim timestamp check failed (it should be in the past)', payload, "iat", "check_failed");
    }
  }
  return payload;
}
var epoch, minute, hour, day, week, year, REGEX, normalizeTyp, checkAudiencePresence, JWTClaimsBuilder;
var init_jwt_claims_set = __esm({
  "node_modules/jose/dist/webapi/lib/jwt_claims_set.js"() {
    init_errors();
    init_buffer_utils();
    init_type_checks();
    epoch = (date) => Math.floor(date.getTime() / 1e3);
    minute = 60;
    hour = minute * 60;
    day = hour * 24;
    week = day * 7;
    year = day * 365.25;
    REGEX = /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i;
    normalizeTyp = (value) => {
      if (value.includes("/")) {
        return value.toLowerCase();
      }
      return `application/${value.toLowerCase()}`;
    };
    checkAudiencePresence = (audPayload, audOption) => {
      if (typeof audPayload === "string") {
        return audOption.includes(audPayload);
      }
      if (Array.isArray(audPayload)) {
        return audOption.some(Set.prototype.has.bind(new Set(audPayload)));
      }
      return false;
    };
    JWTClaimsBuilder = class {
      #payload;
      constructor(payload) {
        if (!isObject2(payload)) {
          throw new TypeError("JWT Claims Set MUST be an object");
        }
        this.#payload = structuredClone(payload);
      }
      data() {
        return encoder.encode(JSON.stringify(this.#payload));
      }
      get iss() {
        return this.#payload.iss;
      }
      set iss(value) {
        this.#payload.iss = value;
      }
      get sub() {
        return this.#payload.sub;
      }
      set sub(value) {
        this.#payload.sub = value;
      }
      get aud() {
        return this.#payload.aud;
      }
      set aud(value) {
        this.#payload.aud = value;
      }
      set jti(value) {
        this.#payload.jti = value;
      }
      set nbf(value) {
        if (typeof value === "number") {
          this.#payload.nbf = validateInput("setNotBefore", value);
        } else if (value instanceof Date) {
          this.#payload.nbf = validateInput("setNotBefore", epoch(value));
        } else {
          this.#payload.nbf = epoch(/* @__PURE__ */ new Date()) + secs(value);
        }
      }
      set exp(value) {
        if (typeof value === "number") {
          this.#payload.exp = validateInput("setExpirationTime", value);
        } else if (value instanceof Date) {
          this.#payload.exp = validateInput("setExpirationTime", epoch(value));
        } else {
          this.#payload.exp = epoch(/* @__PURE__ */ new Date()) + secs(value);
        }
      }
      set iat(value) {
        if (value === void 0) {
          this.#payload.iat = epoch(/* @__PURE__ */ new Date());
        } else if (value instanceof Date) {
          this.#payload.iat = validateInput("setIssuedAt", epoch(value));
        } else if (typeof value === "string") {
          this.#payload.iat = validateInput("setIssuedAt", epoch(/* @__PURE__ */ new Date()) + secs(value));
        } else {
          this.#payload.iat = validateInput("setIssuedAt", value);
        }
      }
    };
  }
});

// node_modules/jose/dist/webapi/jwt/verify.js
async function jwtVerify(jwt, key, options) {
  const verified = await compactVerify(jwt, key, options);
  if (verified.protectedHeader.crit?.includes("b64") && verified.protectedHeader.b64 === false) {
    throw new JWTInvalid("JWTs MUST NOT use unencoded payload");
  }
  const payload = validateClaimsSet(verified.protectedHeader, verified.payload, options);
  const result = { payload, protectedHeader: verified.protectedHeader };
  if (typeof key === "function") {
    return { ...result, key: verified.key };
  }
  return result;
}
var init_verify3 = __esm({
  "node_modules/jose/dist/webapi/jwt/verify.js"() {
    init_verify2();
    init_jwt_claims_set();
    init_errors();
  }
});

// node_modules/jose/dist/webapi/jws/flattened/sign.js
var FlattenedSign;
var init_sign = __esm({
  "node_modules/jose/dist/webapi/jws/flattened/sign.js"() {
    init_base64url();
    init_signing();
    init_type_checks();
    init_errors();
    init_buffer_utils();
    init_check_key_type();
    init_validate_crit();
    init_normalize_key();
    init_helpers();
    FlattenedSign = class {
      #payload;
      #protectedHeader;
      #unprotectedHeader;
      constructor(payload) {
        if (!(payload instanceof Uint8Array)) {
          throw new TypeError("payload must be an instance of Uint8Array");
        }
        this.#payload = payload;
      }
      setProtectedHeader(protectedHeader) {
        assertNotSet(this.#protectedHeader, "setProtectedHeader");
        this.#protectedHeader = protectedHeader;
        return this;
      }
      setUnprotectedHeader(unprotectedHeader) {
        assertNotSet(this.#unprotectedHeader, "setUnprotectedHeader");
        this.#unprotectedHeader = unprotectedHeader;
        return this;
      }
      async sign(key, options) {
        if (!this.#protectedHeader && !this.#unprotectedHeader) {
          throw new JWSInvalid("either setProtectedHeader or setUnprotectedHeader must be called before #sign()");
        }
        if (!isDisjoint(this.#protectedHeader, this.#unprotectedHeader)) {
          throw new JWSInvalid("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
        }
        const joseHeader = {
          ...this.#protectedHeader,
          ...this.#unprotectedHeader
        };
        const extensions = validateCrit(JWSInvalid, /* @__PURE__ */ new Map([["b64", true]]), options?.crit, this.#protectedHeader, joseHeader);
        let b64 = true;
        if (extensions.has("b64")) {
          b64 = this.#protectedHeader.b64;
          if (typeof b64 !== "boolean") {
            throw new JWSInvalid('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
          }
        }
        const { alg } = joseHeader;
        if (typeof alg !== "string" || !alg) {
          throw new JWSInvalid('JWS "alg" (Algorithm) Header Parameter missing or invalid');
        }
        checkKeyType(alg, key, "sign");
        let payloadS;
        let payloadB;
        if (b64) {
          payloadS = encode2(this.#payload);
          payloadB = encode(payloadS);
        } else {
          payloadB = this.#payload;
          payloadS = "";
        }
        let protectedHeaderString;
        let protectedHeaderBytes;
        if (this.#protectedHeader) {
          protectedHeaderString = encode2(JSON.stringify(this.#protectedHeader));
          protectedHeaderBytes = encode(protectedHeaderString);
        } else {
          protectedHeaderString = "";
          protectedHeaderBytes = new Uint8Array();
        }
        const data = concat(protectedHeaderBytes, encode("."), payloadB);
        const k = await normalizeKey(key, alg);
        const signature = await sign(alg, k, data);
        const jws = {
          signature: encode2(signature),
          payload: payloadS
        };
        if (this.#unprotectedHeader) {
          jws.header = this.#unprotectedHeader;
        }
        if (this.#protectedHeader) {
          jws.protected = protectedHeaderString;
        }
        return jws;
      }
    };
  }
});

// node_modules/jose/dist/webapi/jws/compact/sign.js
var CompactSign;
var init_sign2 = __esm({
  "node_modules/jose/dist/webapi/jws/compact/sign.js"() {
    init_sign();
    CompactSign = class {
      #flattened;
      constructor(payload) {
        this.#flattened = new FlattenedSign(payload);
      }
      setProtectedHeader(protectedHeader) {
        this.#flattened.setProtectedHeader(protectedHeader);
        return this;
      }
      async sign(key, options) {
        const jws = await this.#flattened.sign(key, options);
        if (jws.payload === void 0) {
          throw new TypeError("use the flattened module for creating JWS with b64: false");
        }
        return `${jws.protected}.${jws.payload}.${jws.signature}`;
      }
    };
  }
});

// node_modules/jose/dist/webapi/jwt/sign.js
var SignJWT;
var init_sign3 = __esm({
  "node_modules/jose/dist/webapi/jwt/sign.js"() {
    init_sign2();
    init_errors();
    init_jwt_claims_set();
    SignJWT = class {
      #protectedHeader;
      #jwt;
      constructor(payload = {}) {
        this.#jwt = new JWTClaimsBuilder(payload);
      }
      setIssuer(issuer) {
        this.#jwt.iss = issuer;
        return this;
      }
      setSubject(subject) {
        this.#jwt.sub = subject;
        return this;
      }
      setAudience(audience) {
        this.#jwt.aud = audience;
        return this;
      }
      setJti(jwtId) {
        this.#jwt.jti = jwtId;
        return this;
      }
      setNotBefore(input) {
        this.#jwt.nbf = input;
        return this;
      }
      setExpirationTime(input) {
        this.#jwt.exp = input;
        return this;
      }
      setIssuedAt(input) {
        this.#jwt.iat = input;
        return this;
      }
      setProtectedHeader(protectedHeader) {
        this.#protectedHeader = protectedHeader;
        return this;
      }
      async sign(key, options) {
        const sig = new CompactSign(this.#jwt.data());
        sig.setProtectedHeader(this.#protectedHeader);
        if (Array.isArray(this.#protectedHeader?.crit) && this.#protectedHeader.crit.includes("b64") && this.#protectedHeader.b64 === false) {
          throw new JWTInvalid("JWTs MUST NOT use unencoded payload");
        }
        return sig.sign(key, options);
      }
    };
  }
});

// node_modules/jose/dist/webapi/index.js
var init_webapi = __esm({
  "node_modules/jose/dist/webapi/index.js"() {
    init_verify3();
    init_sign3();
  }
});

// helpers/getSetServerSession.tsx
async function getServerSessionOrThrow(request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const cookies = cookieHeader.split(";").reduce((cookies2, cookie) => {
    const [name, value] = cookie.trim().split("=");
    if (name && value) {
      cookies2[name] = decodeURIComponent(value);
    }
    return cookies2;
  }, {});
  const sessionCookie = cookies[CookieName];
  if (!sessionCookie) {
    throw new NotAuthenticatedError();
  }
  try {
    const { payload } = await jwtVerify(sessionCookie, encoder2.encode(secret));
    return {
      id: payload.id,
      createdAt: payload.createdAt,
      lastAccessed: payload.lastAccessed,
      passwordChangeRequired: payload.passwordChangeRequired
    };
  } catch (error) {
    throw new NotAuthenticatedError();
  }
}
async function setServerSession(response, session) {
  const token = await new SignJWT({
    id: session.id,
    createdAt: session.createdAt,
    lastAccessed: session.lastAccessed,
    passwordChangeRequired: session.passwordChangeRequired
  }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(encoder2.encode(secret));
  const cookieValue = [
    `${CookieName}=${token}`,
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Path=/",
    `Max-Age=${SessionExpirationSeconds}`
  ].join("; ");
  response.headers.set("Set-Cookie", cookieValue);
}
function clearServerSession(response) {
  const cookieValue = [
    `${CookieName}=`,
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Path=/",
    "Max-Age=0"
  ].join("; ");
  response.headers.set("Set-Cookie", cookieValue);
}
var encoder2, secret, SessionExpirationSeconds, CleanupProbability, CookieName, NotAuthenticatedError;
var init_getSetServerSession = __esm({
  "helpers/getSetServerSession.tsx"() {
    "use strict";
    init_webapi();
    encoder2 = new TextEncoder();
    secret = process.env.JWT_SECRET;
    if (!secret || secret === "... fill this up ...") {
      throw new Error(`JWT_SECRET environment variable is not configured. Generate one with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`);
    }
    SessionExpirationSeconds = 60 * 60 * 24 * 7;
    CleanupProbability = 0.1;
    CookieName = "floot_built_app_session";
    NotAuthenticatedError = class extends Error {
      constructor(message2) {
        super(message2 ?? "Not authenticated");
        this.name = "NotAuthenticatedError";
      }
    };
  }
});

// helpers/getServerUserSession.tsx
async function getServerUserSession(request) {
  const session = await getServerSessionOrThrow(request);
  if (Math.random() < CleanupProbability) {
    const expirationDate = new Date(
      Date.now() - SessionExpirationSeconds * 1e3
    );
    try {
      await db.deleteFrom("sessions").where("lastAccessed", "<", expirationDate).execute();
    } catch (cleanupError) {
      console.error("Session cleanup error:", cleanupError);
    }
  }
  const results = await db.selectFrom("sessions").innerJoin("users", "sessions.userId", "users.id").select([
    "sessions.id as sessionId",
    "sessions.createdAt as sessionCreatedAt",
    "sessions.lastAccessed as sessionLastAccessed",
    "users.id",
    "users.email",
    "users.displayName",
    "users.role",
    "users.avatarUrl"
  ]).where("sessions.id", "=", session.id).limit(1).execute();
  if (results.length === 0) {
    throw new NotAuthenticatedError();
  }
  const result = results[0];
  const user = {
    id: result.id,
    email: result.email,
    displayName: result.displayName,
    avatarUrl: result.avatarUrl,
    role: result.role
  };
  const now = /* @__PURE__ */ new Date();
  await db.updateTable("sessions").set({ lastAccessed: now }).where("id", "=", session.id).execute();
  return {
    user,
    // make sure to update the session in cookie
    session: {
      ...session,
      lastAccessed: now
    }
  };
}
var init_getServerUserSession = __esm({
  "helpers/getServerUserSession.tsx"() {
    "use strict";
    init_db();
    init_getSetServerSession();
  }
});

// endpoints/settings_GET.ts
var settings_GET_exports = {};
__export(settings_GET_exports, {
  handle: () => handle2
});
async function handle2(request) {
  try {
    await getServerUserSession(request);
    let settings = await db.selectFrom("settings").selectAll().where("id", "=", "default").executeTakeFirst();
    if (!settings) {
      settings = await db.insertInto("settings").values({
        id: "default",
        audioVolume: 50,
        speechRate: "normal",
        voiceType: "feminine",
        defaultVisionMode: "smart",
        updateIntervalMs: 1e3,
        headRotationThreshold: 15,
        confidenceThreshold: 0.7,
        alertPriority: true,
        vibrationFeedback: true,
        updatedAt: /* @__PURE__ */ new Date()
      }).returningAll().executeTakeFirstOrThrow();
    }
    return new Response(SuperJSON.stringify(settings));
  } catch (error) {
    if (error instanceof NotAuthenticatedError) {
      return new Response(SuperJSON.stringify({ error: "Not authenticated" }), { status: 401 });
    }
    const message2 = error instanceof Error ? error.message : "Unknown error";
    return new Response(SuperJSON.stringify({ error: message2 }), { status: 400 });
  }
}
var init_settings_GET = __esm({
  "endpoints/settings_GET.ts"() {
    "use strict";
    init_dist3();
    init_db();
    init_getServerUserSession();
    init_getSetServerSession();
  }
});

// endpoints/auth/logout_POST.ts
var logout_POST_exports = {};
__export(logout_POST_exports, {
  handle: () => handle3
});
async function handle3(request) {
  try {
    const session = await getServerSessionOrThrow(request);
    await db.deleteFrom("sessions").where("id", "=", session.id).execute();
    const response = Response.json({
      success: true,
      message: "Logged out successfully"
    });
    clearServerSession(response);
    return response;
  } catch (error) {
    if (error instanceof NotAuthenticatedError) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }
    console.error("Logout error:", error);
    return Response.json(
      {
        error: "Logout failed",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
var init_logout_POST = __esm({
  "endpoints/auth/logout_POST.ts"() {
    "use strict";
    init_db();
    init_getSetServerSession();
  }
});

// endpoints/auth/session_GET.ts
var session_GET_exports = {};
__export(session_GET_exports, {
  handle: () => handle4
});
async function handle4(request) {
  try {
    const { user, session } = await getServerUserSession(request);
    const response = Response.json({
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        role: user.role
      }
    });
    await setServerSession(response, {
      id: session.id,
      createdAt: session.createdAt,
      lastAccessed: session.lastAccessed.getTime()
    });
    return response;
  } catch (error) {
    if (error instanceof NotAuthenticatedError) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }
    console.error("Session validation error:", error);
    return Response.json(
      { error: "Session validation failed" },
      { status: 400 }
    );
  }
}
var init_session_GET = __esm({
  "endpoints/auth/session_GET.ts"() {
    "use strict";
    init_getSetServerSession();
    init_getServerUserSession();
  }
});

// node_modules/zod/v3/helpers/util.js
var util, objectUtil, ZodParsedType, getParsedType;
var init_util2 = __esm({
  "node_modules/zod/v3/helpers/util.js"() {
    (function(util2) {
      util2.assertEqual = (_) => {
      };
      function assertIs(_arg) {
      }
      util2.assertIs = assertIs;
      function assertNever(_x) {
        throw new Error();
      }
      util2.assertNever = assertNever;
      util2.arrayToEnum = (items) => {
        const obj = {};
        for (const item of items) {
          obj[item] = item;
        }
        return obj;
      };
      util2.getValidEnumValues = (obj) => {
        const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
        const filtered = {};
        for (const k of validKeys) {
          filtered[k] = obj[k];
        }
        return util2.objectValues(filtered);
      };
      util2.objectValues = (obj) => {
        return util2.objectKeys(obj).map(function(e) {
          return obj[e];
        });
      };
      util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
        const keys = [];
        for (const key in object) {
          if (Object.prototype.hasOwnProperty.call(object, key)) {
            keys.push(key);
          }
        }
        return keys;
      };
      util2.find = (arr, checker) => {
        for (const item of arr) {
          if (checker(item))
            return item;
        }
        return void 0;
      };
      util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
      function joinValues(array, separator = " | ") {
        return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
      }
      util2.joinValues = joinValues;
      util2.jsonStringifyReplacer = (_, value) => {
        if (typeof value === "bigint") {
          return value.toString();
        }
        return value;
      };
    })(util || (util = {}));
    (function(objectUtil2) {
      objectUtil2.mergeShapes = (first, second) => {
        return {
          ...first,
          ...second
          // second overwrites first
        };
      };
    })(objectUtil || (objectUtil = {}));
    ZodParsedType = util.arrayToEnum([
      "string",
      "nan",
      "number",
      "integer",
      "float",
      "boolean",
      "date",
      "bigint",
      "symbol",
      "function",
      "undefined",
      "null",
      "array",
      "object",
      "unknown",
      "promise",
      "void",
      "never",
      "map",
      "set"
    ]);
    getParsedType = (data) => {
      const t = typeof data;
      switch (t) {
        case "undefined":
          return ZodParsedType.undefined;
        case "string":
          return ZodParsedType.string;
        case "number":
          return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
        case "boolean":
          return ZodParsedType.boolean;
        case "function":
          return ZodParsedType.function;
        case "bigint":
          return ZodParsedType.bigint;
        case "symbol":
          return ZodParsedType.symbol;
        case "object":
          if (Array.isArray(data)) {
            return ZodParsedType.array;
          }
          if (data === null) {
            return ZodParsedType.null;
          }
          if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
            return ZodParsedType.promise;
          }
          if (typeof Map !== "undefined" && data instanceof Map) {
            return ZodParsedType.map;
          }
          if (typeof Set !== "undefined" && data instanceof Set) {
            return ZodParsedType.set;
          }
          if (typeof Date !== "undefined" && data instanceof Date) {
            return ZodParsedType.date;
          }
          return ZodParsedType.object;
        default:
          return ZodParsedType.unknown;
      }
    };
  }
});

// node_modules/zod/v3/ZodError.js
var ZodIssueCode, quotelessJson, ZodError;
var init_ZodError = __esm({
  "node_modules/zod/v3/ZodError.js"() {
    init_util2();
    ZodIssueCode = util.arrayToEnum([
      "invalid_type",
      "invalid_literal",
      "custom",
      "invalid_union",
      "invalid_union_discriminator",
      "invalid_enum_value",
      "unrecognized_keys",
      "invalid_arguments",
      "invalid_return_type",
      "invalid_date",
      "invalid_string",
      "too_small",
      "too_big",
      "invalid_intersection_types",
      "not_multiple_of",
      "not_finite"
    ]);
    quotelessJson = (obj) => {
      const json = JSON.stringify(obj, null, 2);
      return json.replace(/"([^"]+)":/g, "$1:");
    };
    ZodError = class _ZodError extends Error {
      get errors() {
        return this.issues;
      }
      constructor(issues) {
        super();
        this.issues = [];
        this.addIssue = (sub) => {
          this.issues = [...this.issues, sub];
        };
        this.addIssues = (subs = []) => {
          this.issues = [...this.issues, ...subs];
        };
        const actualProto = new.target.prototype;
        if (Object.setPrototypeOf) {
          Object.setPrototypeOf(this, actualProto);
        } else {
          this.__proto__ = actualProto;
        }
        this.name = "ZodError";
        this.issues = issues;
      }
      format(_mapper) {
        const mapper = _mapper || function(issue) {
          return issue.message;
        };
        const fieldErrors = { _errors: [] };
        const processError = (error) => {
          for (const issue of error.issues) {
            if (issue.code === "invalid_union") {
              issue.unionErrors.map(processError);
            } else if (issue.code === "invalid_return_type") {
              processError(issue.returnTypeError);
            } else if (issue.code === "invalid_arguments") {
              processError(issue.argumentsError);
            } else if (issue.path.length === 0) {
              fieldErrors._errors.push(mapper(issue));
            } else {
              let curr = fieldErrors;
              let i = 0;
              while (i < issue.path.length) {
                const el = issue.path[i];
                const terminal = i === issue.path.length - 1;
                if (!terminal) {
                  curr[el] = curr[el] || { _errors: [] };
                } else {
                  curr[el] = curr[el] || { _errors: [] };
                  curr[el]._errors.push(mapper(issue));
                }
                curr = curr[el];
                i++;
              }
            }
          }
        };
        processError(this);
        return fieldErrors;
      }
      static assert(value) {
        if (!(value instanceof _ZodError)) {
          throw new Error(`Not a ZodError: ${value}`);
        }
      }
      toString() {
        return this.message;
      }
      get message() {
        return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
      }
      get isEmpty() {
        return this.issues.length === 0;
      }
      flatten(mapper = (issue) => issue.message) {
        const fieldErrors = {};
        const formErrors = [];
        for (const sub of this.issues) {
          if (sub.path.length > 0) {
            const firstEl = sub.path[0];
            fieldErrors[firstEl] = fieldErrors[firstEl] || [];
            fieldErrors[firstEl].push(mapper(sub));
          } else {
            formErrors.push(mapper(sub));
          }
        }
        return { formErrors, fieldErrors };
      }
      get formErrors() {
        return this.flatten();
      }
    };
    ZodError.create = (issues) => {
      const error = new ZodError(issues);
      return error;
    };
  }
});

// node_modules/zod/v3/locales/en.js
var errorMap, en_default;
var init_en = __esm({
  "node_modules/zod/v3/locales/en.js"() {
    init_ZodError();
    init_util2();
    errorMap = (issue, _ctx) => {
      let message2;
      switch (issue.code) {
        case ZodIssueCode.invalid_type:
          if (issue.received === ZodParsedType.undefined) {
            message2 = "Required";
          } else {
            message2 = `Expected ${issue.expected}, received ${issue.received}`;
          }
          break;
        case ZodIssueCode.invalid_literal:
          message2 = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
          break;
        case ZodIssueCode.unrecognized_keys:
          message2 = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
          break;
        case ZodIssueCode.invalid_union:
          message2 = `Invalid input`;
          break;
        case ZodIssueCode.invalid_union_discriminator:
          message2 = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
          break;
        case ZodIssueCode.invalid_enum_value:
          message2 = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
          break;
        case ZodIssueCode.invalid_arguments:
          message2 = `Invalid function arguments`;
          break;
        case ZodIssueCode.invalid_return_type:
          message2 = `Invalid function return type`;
          break;
        case ZodIssueCode.invalid_date:
          message2 = `Invalid date`;
          break;
        case ZodIssueCode.invalid_string:
          if (typeof issue.validation === "object") {
            if ("includes" in issue.validation) {
              message2 = `Invalid input: must include "${issue.validation.includes}"`;
              if (typeof issue.validation.position === "number") {
                message2 = `${message2} at one or more positions greater than or equal to ${issue.validation.position}`;
              }
            } else if ("startsWith" in issue.validation) {
              message2 = `Invalid input: must start with "${issue.validation.startsWith}"`;
            } else if ("endsWith" in issue.validation) {
              message2 = `Invalid input: must end with "${issue.validation.endsWith}"`;
            } else {
              util.assertNever(issue.validation);
            }
          } else if (issue.validation !== "regex") {
            message2 = `Invalid ${issue.validation}`;
          } else {
            message2 = "Invalid";
          }
          break;
        case ZodIssueCode.too_small:
          if (issue.type === "array")
            message2 = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
          else if (issue.type === "string")
            message2 = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
          else if (issue.type === "number")
            message2 = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
          else if (issue.type === "bigint")
            message2 = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
          else if (issue.type === "date")
            message2 = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
          else
            message2 = "Invalid input";
          break;
        case ZodIssueCode.too_big:
          if (issue.type === "array")
            message2 = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
          else if (issue.type === "string")
            message2 = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
          else if (issue.type === "number")
            message2 = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
          else if (issue.type === "bigint")
            message2 = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
          else if (issue.type === "date")
            message2 = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
          else
            message2 = "Invalid input";
          break;
        case ZodIssueCode.custom:
          message2 = `Invalid input`;
          break;
        case ZodIssueCode.invalid_intersection_types:
          message2 = `Intersection results could not be merged`;
          break;
        case ZodIssueCode.not_multiple_of:
          message2 = `Number must be a multiple of ${issue.multipleOf}`;
          break;
        case ZodIssueCode.not_finite:
          message2 = "Number must be finite";
          break;
        default:
          message2 = _ctx.defaultError;
          util.assertNever(issue);
      }
      return { message: message2 };
    };
    en_default = errorMap;
  }
});

// node_modules/zod/v3/errors.js
function setErrorMap(map) {
  overrideErrorMap = map;
}
function getErrorMap() {
  return overrideErrorMap;
}
var overrideErrorMap;
var init_errors2 = __esm({
  "node_modules/zod/v3/errors.js"() {
    init_en();
    overrideErrorMap = en_default;
  }
});

// node_modules/zod/v3/helpers/parseUtil.js
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      // contextual error map is first priority
      ctx.schemaErrorMap,
      // then schema-bound map if available
      overrideMap,
      // then global override map
      overrideMap === en_default ? void 0 : en_default
      // then global default map
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}
var makeIssue, EMPTY_PATH, ParseStatus, INVALID, DIRTY, OK, isAborted, isDirty, isValid, isAsync;
var init_parseUtil = __esm({
  "node_modules/zod/v3/helpers/parseUtil.js"() {
    init_errors2();
    init_en();
    makeIssue = (params) => {
      const { data, path, errorMaps, issueData } = params;
      const fullPath = [...path, ...issueData.path || []];
      const fullIssue = {
        ...issueData,
        path: fullPath
      };
      if (issueData.message !== void 0) {
        return {
          ...issueData,
          path: fullPath,
          message: issueData.message
        };
      }
      let errorMessage = "";
      const maps = errorMaps.filter((m) => !!m).slice().reverse();
      for (const map of maps) {
        errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
      }
      return {
        ...issueData,
        path: fullPath,
        message: errorMessage
      };
    };
    EMPTY_PATH = [];
    ParseStatus = class _ParseStatus {
      constructor() {
        this.value = "valid";
      }
      dirty() {
        if (this.value === "valid")
          this.value = "dirty";
      }
      abort() {
        if (this.value !== "aborted")
          this.value = "aborted";
      }
      static mergeArray(status, results) {
        const arrayValue = [];
        for (const s of results) {
          if (s.status === "aborted")
            return INVALID;
          if (s.status === "dirty")
            status.dirty();
          arrayValue.push(s.value);
        }
        return { status: status.value, value: arrayValue };
      }
      static async mergeObjectAsync(status, pairs) {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value
          });
        }
        return _ParseStatus.mergeObjectSync(status, syncPairs);
      }
      static mergeObjectSync(status, pairs) {
        const finalObject = {};
        for (const pair of pairs) {
          const { key, value } = pair;
          if (key.status === "aborted")
            return INVALID;
          if (value.status === "aborted")
            return INVALID;
          if (key.status === "dirty")
            status.dirty();
          if (value.status === "dirty")
            status.dirty();
          if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
            finalObject[key.value] = value.value;
          }
        }
        return { status: status.value, value: finalObject };
      }
    };
    INVALID = Object.freeze({
      status: "aborted"
    });
    DIRTY = (value) => ({ status: "dirty", value });
    OK = (value) => ({ status: "valid", value });
    isAborted = (x) => x.status === "aborted";
    isDirty = (x) => x.status === "dirty";
    isValid = (x) => x.status === "valid";
    isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;
  }
});

// node_modules/zod/v3/helpers/typeAliases.js
var init_typeAliases = __esm({
  "node_modules/zod/v3/helpers/typeAliases.js"() {
  }
});

// node_modules/zod/v3/helpers/errorUtil.js
var errorUtil;
var init_errorUtil = __esm({
  "node_modules/zod/v3/helpers/errorUtil.js"() {
    (function(errorUtil2) {
      errorUtil2.errToObj = (message2) => typeof message2 === "string" ? { message: message2 } : message2 || {};
      errorUtil2.toString = (message2) => typeof message2 === "string" ? message2 : message2?.message;
    })(errorUtil || (errorUtil = {}));
  }
});

// node_modules/zod/v3/types.js
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = (iss, ctx) => {
    const { message: message2 } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message2 ?? ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: message2 ?? required_error ?? ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: message2 ?? invalid_type_error ?? ctx.defaultError };
  };
  return { errorMap: customMap, description };
}
function timeRegexSource(args) {
  let secondsRegexSource = `[0-5]\\d`;
  if (args.precision) {
    secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
  }
  const secondsQuantifier = args.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version) {
  if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt))
    return false;
  try {
    const [header] = jwt.split(".");
    if (!header)
      return false;
    const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if ("typ" in decoded && decoded?.typ !== "JWT")
      return false;
    if (!decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch {
    return false;
  }
}
function isValidCidr(ip, version) {
  if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / 10 ** decCount;
}
function deepPartialify(schema9) {
  if (schema9 instanceof ZodObject) {
    const newShape = {};
    for (const key in schema9.shape) {
      const fieldSchema = schema9.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema9._def,
      shape: () => newShape
    });
  } else if (schema9 instanceof ZodArray) {
    return new ZodArray({
      ...schema9._def,
      type: deepPartialify(schema9.element)
    });
  } else if (schema9 instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema9.unwrap()));
  } else if (schema9 instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema9.unwrap()));
  } else if (schema9 instanceof ZodTuple) {
    return ZodTuple.create(schema9.items.map((item) => deepPartialify(item)));
  } else {
    return schema9;
  }
}
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}
function cleanParams(params, data) {
  const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
  const p2 = typeof p === "string" ? { message: p } : p;
  return p2;
}
function custom(check, _params = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      const r = check(data);
      if (r instanceof Promise) {
        return r.then((r2) => {
          if (!r2) {
            const params = cleanParams(_params, data);
            const _fatal = params.fatal ?? fatal ?? true;
            ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
          }
        });
      }
      if (!r) {
        const params = cleanParams(_params, data);
        const _fatal = params.fatal ?? fatal ?? true;
        ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
      }
      return;
    });
  return ZodAny.create();
}
var ParseInputLazyPath, handleResult, ZodType, cuidRegex, cuid2Regex, ulidRegex, uuidRegex, nanoidRegex, jwtRegex, durationRegex, emailRegex, _emojiRegex, emojiRegex, ipv4Regex, ipv4CidrRegex, ipv6Regex, ipv6CidrRegex, base64Regex, base64urlRegex, dateRegexSource, dateRegex, ZodString, ZodNumber, ZodBigInt, ZodBoolean, ZodDate, ZodSymbol, ZodUndefined, ZodNull, ZodAny, ZodUnknown, ZodNever, ZodVoid, ZodArray, ZodObject, ZodUnion, getDiscriminator, ZodDiscriminatedUnion, ZodIntersection, ZodTuple, ZodRecord, ZodMap, ZodSet, ZodFunction, ZodLazy, ZodLiteral, ZodEnum, ZodNativeEnum, ZodPromise, ZodEffects, ZodOptional, ZodNullable, ZodDefault, ZodCatch, ZodNaN, BRAND, ZodBranded, ZodPipeline, ZodReadonly, late, ZodFirstPartyTypeKind, instanceOfType, stringType, numberType, nanType, bigIntType, booleanType, dateType, symbolType, undefinedType, nullType, anyType, unknownType, neverType, voidType, arrayType, objectType, strictObjectType, unionType, discriminatedUnionType, intersectionType, tupleType, recordType, mapType, setType, functionType, lazyType, literalType, enumType, nativeEnumType, promiseType, effectsType, optionalType, nullableType, preprocessType, pipelineType, ostring, onumber, oboolean, coerce, NEVER;
var init_types = __esm({
  "node_modules/zod/v3/types.js"() {
    init_ZodError();
    init_errors2();
    init_errorUtil();
    init_parseUtil();
    init_util2();
    ParseInputLazyPath = class {
      constructor(parent, value, path, key) {
        this._cachedPath = [];
        this.parent = parent;
        this.data = value;
        this._path = path;
        this._key = key;
      }
      get path() {
        if (!this._cachedPath.length) {
          if (Array.isArray(this._key)) {
            this._cachedPath.push(...this._path, ...this._key);
          } else {
            this._cachedPath.push(...this._path, this._key);
          }
        }
        return this._cachedPath;
      }
    };
    handleResult = (ctx, result) => {
      if (isValid(result)) {
        return { success: true, data: result.value };
      } else {
        if (!ctx.common.issues.length) {
          throw new Error("Validation failed but no issues detected.");
        }
        return {
          success: false,
          get error() {
            if (this._error)
              return this._error;
            const error = new ZodError(ctx.common.issues);
            this._error = error;
            return this._error;
          }
        };
      }
    };
    ZodType = class {
      get description() {
        return this._def.description;
      }
      _getType(input) {
        return getParsedType(input.data);
      }
      _getOrReturnCtx(input, ctx) {
        return ctx || {
          common: input.parent.common,
          data: input.data,
          parsedType: getParsedType(input.data),
          schemaErrorMap: this._def.errorMap,
          path: input.path,
          parent: input.parent
        };
      }
      _processInputParams(input) {
        return {
          status: new ParseStatus(),
          ctx: {
            common: input.parent.common,
            data: input.data,
            parsedType: getParsedType(input.data),
            schemaErrorMap: this._def.errorMap,
            path: input.path,
            parent: input.parent
          }
        };
      }
      _parseSync(input) {
        const result = this._parse(input);
        if (isAsync(result)) {
          throw new Error("Synchronous parse encountered promise.");
        }
        return result;
      }
      _parseAsync(input) {
        const result = this._parse(input);
        return Promise.resolve(result);
      }
      parse(data, params) {
        const result = this.safeParse(data, params);
        if (result.success)
          return result.data;
        throw result.error;
      }
      safeParse(data, params) {
        const ctx = {
          common: {
            issues: [],
            async: params?.async ?? false,
            contextualErrorMap: params?.errorMap
          },
          path: params?.path || [],
          schemaErrorMap: this._def.errorMap,
          parent: null,
          data,
          parsedType: getParsedType(data)
        };
        const result = this._parseSync({ data, path: ctx.path, parent: ctx });
        return handleResult(ctx, result);
      }
      "~validate"(data) {
        const ctx = {
          common: {
            issues: [],
            async: !!this["~standard"].async
          },
          path: [],
          schemaErrorMap: this._def.errorMap,
          parent: null,
          data,
          parsedType: getParsedType(data)
        };
        if (!this["~standard"].async) {
          try {
            const result = this._parseSync({ data, path: [], parent: ctx });
            return isValid(result) ? {
              value: result.value
            } : {
              issues: ctx.common.issues
            };
          } catch (err) {
            if (err?.message?.toLowerCase()?.includes("encountered")) {
              this["~standard"].async = true;
            }
            ctx.common = {
              issues: [],
              async: true
            };
          }
        }
        return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        });
      }
      async parseAsync(data, params) {
        const result = await this.safeParseAsync(data, params);
        if (result.success)
          return result.data;
        throw result.error;
      }
      async safeParseAsync(data, params) {
        const ctx = {
          common: {
            issues: [],
            contextualErrorMap: params?.errorMap,
            async: true
          },
          path: params?.path || [],
          schemaErrorMap: this._def.errorMap,
          parent: null,
          data,
          parsedType: getParsedType(data)
        };
        const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
        const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
        return handleResult(ctx, result);
      }
      refine(check, message2) {
        const getIssueProperties = (val) => {
          if (typeof message2 === "string" || typeof message2 === "undefined") {
            return { message: message2 };
          } else if (typeof message2 === "function") {
            return message2(val);
          } else {
            return message2;
          }
        };
        return this._refinement((val, ctx) => {
          const result = check(val);
          const setError = () => ctx.addIssue({
            code: ZodIssueCode.custom,
            ...getIssueProperties(val)
          });
          if (typeof Promise !== "undefined" && result instanceof Promise) {
            return result.then((data) => {
              if (!data) {
                setError();
                return false;
              } else {
                return true;
              }
            });
          }
          if (!result) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      refinement(check, refinementData) {
        return this._refinement((val, ctx) => {
          if (!check(val)) {
            ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
            return false;
          } else {
            return true;
          }
        });
      }
      _refinement(refinement) {
        return new ZodEffects({
          schema: this,
          typeName: ZodFirstPartyTypeKind.ZodEffects,
          effect: { type: "refinement", refinement }
        });
      }
      superRefine(refinement) {
        return this._refinement(refinement);
      }
      constructor(def) {
        this.spa = this.safeParseAsync;
        this._def = def;
        this.parse = this.parse.bind(this);
        this.safeParse = this.safeParse.bind(this);
        this.parseAsync = this.parseAsync.bind(this);
        this.safeParseAsync = this.safeParseAsync.bind(this);
        this.spa = this.spa.bind(this);
        this.refine = this.refine.bind(this);
        this.refinement = this.refinement.bind(this);
        this.superRefine = this.superRefine.bind(this);
        this.optional = this.optional.bind(this);
        this.nullable = this.nullable.bind(this);
        this.nullish = this.nullish.bind(this);
        this.array = this.array.bind(this);
        this.promise = this.promise.bind(this);
        this.or = this.or.bind(this);
        this.and = this.and.bind(this);
        this.transform = this.transform.bind(this);
        this.brand = this.brand.bind(this);
        this.default = this.default.bind(this);
        this.catch = this.catch.bind(this);
        this.describe = this.describe.bind(this);
        this.pipe = this.pipe.bind(this);
        this.readonly = this.readonly.bind(this);
        this.isNullable = this.isNullable.bind(this);
        this.isOptional = this.isOptional.bind(this);
        this["~standard"] = {
          version: 1,
          vendor: "zod",
          validate: (data) => this["~validate"](data)
        };
      }
      optional() {
        return ZodOptional.create(this, this._def);
      }
      nullable() {
        return ZodNullable.create(this, this._def);
      }
      nullish() {
        return this.nullable().optional();
      }
      array() {
        return ZodArray.create(this);
      }
      promise() {
        return ZodPromise.create(this, this._def);
      }
      or(option) {
        return ZodUnion.create([this, option], this._def);
      }
      and(incoming) {
        return ZodIntersection.create(this, incoming, this._def);
      }
      transform(transform) {
        return new ZodEffects({
          ...processCreateParams(this._def),
          schema: this,
          typeName: ZodFirstPartyTypeKind.ZodEffects,
          effect: { type: "transform", transform }
        });
      }
      default(def) {
        const defaultValueFunc = typeof def === "function" ? def : () => def;
        return new ZodDefault({
          ...processCreateParams(this._def),
          innerType: this,
          defaultValue: defaultValueFunc,
          typeName: ZodFirstPartyTypeKind.ZodDefault
        });
      }
      brand() {
        return new ZodBranded({
          typeName: ZodFirstPartyTypeKind.ZodBranded,
          type: this,
          ...processCreateParams(this._def)
        });
      }
      catch(def) {
        const catchValueFunc = typeof def === "function" ? def : () => def;
        return new ZodCatch({
          ...processCreateParams(this._def),
          innerType: this,
          catchValue: catchValueFunc,
          typeName: ZodFirstPartyTypeKind.ZodCatch
        });
      }
      describe(description) {
        const This = this.constructor;
        return new This({
          ...this._def,
          description
        });
      }
      pipe(target) {
        return ZodPipeline.create(this, target);
      }
      readonly() {
        return ZodReadonly.create(this);
      }
      isOptional() {
        return this.safeParse(void 0).success;
      }
      isNullable() {
        return this.safeParse(null).success;
      }
    };
    cuidRegex = /^c[^\s-]{8,}$/i;
    cuid2Regex = /^[0-9a-z]+$/;
    ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
    uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
    nanoidRegex = /^[a-z0-9_-]{21}$/i;
    jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
    durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
    emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
    _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
    ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
    ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
    ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
    ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
    base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
    dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
    dateRegex = new RegExp(`^${dateRegexSource}$`);
    ZodString = class _ZodString extends ZodType {
      _parse(input) {
        if (this._def.coerce) {
          input.data = String(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.string) {
          const ctx2 = this._getOrReturnCtx(input);
          addIssueToContext(ctx2, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.string,
            received: ctx2.parsedType
          });
          return INVALID;
        }
        const status = new ParseStatus();
        let ctx = void 0;
        for (const check of this._def.checks) {
          if (check.kind === "min") {
            if (input.data.length < check.value) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_small,
                minimum: check.value,
                type: "string",
                inclusive: true,
                exact: false,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "max") {
            if (input.data.length > check.value) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_big,
                maximum: check.value,
                type: "string",
                inclusive: true,
                exact: false,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "length") {
            const tooBig = input.data.length > check.value;
            const tooSmall = input.data.length < check.value;
            if (tooBig || tooSmall) {
              ctx = this._getOrReturnCtx(input, ctx);
              if (tooBig) {
                addIssueToContext(ctx, {
                  code: ZodIssueCode.too_big,
                  maximum: check.value,
                  type: "string",
                  inclusive: true,
                  exact: true,
                  message: check.message
                });
              } else if (tooSmall) {
                addIssueToContext(ctx, {
                  code: ZodIssueCode.too_small,
                  minimum: check.value,
                  type: "string",
                  inclusive: true,
                  exact: true,
                  message: check.message
                });
              }
              status.dirty();
            }
          } else if (check.kind === "email") {
            if (!emailRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "email",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "emoji") {
            if (!emojiRegex) {
              emojiRegex = new RegExp(_emojiRegex, "u");
            }
            if (!emojiRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "emoji",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "uuid") {
            if (!uuidRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "uuid",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "nanoid") {
            if (!nanoidRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "nanoid",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "cuid") {
            if (!cuidRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "cuid",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "cuid2") {
            if (!cuid2Regex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "cuid2",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "ulid") {
            if (!ulidRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "ulid",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "url") {
            try {
              new URL(input.data);
            } catch {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "url",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "regex") {
            check.regex.lastIndex = 0;
            const testResult = check.regex.test(input.data);
            if (!testResult) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "regex",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "trim") {
            input.data = input.data.trim();
          } else if (check.kind === "includes") {
            if (!input.data.includes(check.value, check.position)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: { includes: check.value, position: check.position },
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "toLowerCase") {
            input.data = input.data.toLowerCase();
          } else if (check.kind === "toUpperCase") {
            input.data = input.data.toUpperCase();
          } else if (check.kind === "startsWith") {
            if (!input.data.startsWith(check.value)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: { startsWith: check.value },
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "endsWith") {
            if (!input.data.endsWith(check.value)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: { endsWith: check.value },
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "datetime") {
            const regex = datetimeRegex(check);
            if (!regex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: "datetime",
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "date") {
            const regex = dateRegex;
            if (!regex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: "date",
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "time") {
            const regex = timeRegex(check);
            if (!regex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: "time",
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "duration") {
            if (!durationRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "duration",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "ip") {
            if (!isValidIP(input.data, check.version)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "ip",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "jwt") {
            if (!isValidJWT(input.data, check.alg)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "jwt",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "cidr") {
            if (!isValidCidr(input.data, check.version)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "cidr",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "base64") {
            if (!base64Regex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "base64",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "base64url") {
            if (!base64urlRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "base64url",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else {
            util.assertNever(check);
          }
        }
        return { status: status.value, value: input.data };
      }
      _regex(regex, validation, message2) {
        return this.refinement((data) => regex.test(data), {
          validation,
          code: ZodIssueCode.invalid_string,
          ...errorUtil.errToObj(message2)
        });
      }
      _addCheck(check) {
        return new _ZodString({
          ...this._def,
          checks: [...this._def.checks, check]
        });
      }
      email(message2) {
        return this._addCheck({ kind: "email", ...errorUtil.errToObj(message2) });
      }
      url(message2) {
        return this._addCheck({ kind: "url", ...errorUtil.errToObj(message2) });
      }
      emoji(message2) {
        return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message2) });
      }
      uuid(message2) {
        return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message2) });
      }
      nanoid(message2) {
        return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message2) });
      }
      cuid(message2) {
        return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message2) });
      }
      cuid2(message2) {
        return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message2) });
      }
      ulid(message2) {
        return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message2) });
      }
      base64(message2) {
        return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message2) });
      }
      base64url(message2) {
        return this._addCheck({
          kind: "base64url",
          ...errorUtil.errToObj(message2)
        });
      }
      jwt(options) {
        return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
      }
      ip(options) {
        return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
      }
      cidr(options) {
        return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
      }
      datetime(options) {
        if (typeof options === "string") {
          return this._addCheck({
            kind: "datetime",
            precision: null,
            offset: false,
            local: false,
            message: options
          });
        }
        return this._addCheck({
          kind: "datetime",
          precision: typeof options?.precision === "undefined" ? null : options?.precision,
          offset: options?.offset ?? false,
          local: options?.local ?? false,
          ...errorUtil.errToObj(options?.message)
        });
      }
      date(message2) {
        return this._addCheck({ kind: "date", message: message2 });
      }
      time(options) {
        if (typeof options === "string") {
          return this._addCheck({
            kind: "time",
            precision: null,
            message: options
          });
        }
        return this._addCheck({
          kind: "time",
          precision: typeof options?.precision === "undefined" ? null : options?.precision,
          ...errorUtil.errToObj(options?.message)
        });
      }
      duration(message2) {
        return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message2) });
      }
      regex(regex, message2) {
        return this._addCheck({
          kind: "regex",
          regex,
          ...errorUtil.errToObj(message2)
        });
      }
      includes(value, options) {
        return this._addCheck({
          kind: "includes",
          value,
          position: options?.position,
          ...errorUtil.errToObj(options?.message)
        });
      }
      startsWith(value, message2) {
        return this._addCheck({
          kind: "startsWith",
          value,
          ...errorUtil.errToObj(message2)
        });
      }
      endsWith(value, message2) {
        return this._addCheck({
          kind: "endsWith",
          value,
          ...errorUtil.errToObj(message2)
        });
      }
      min(minLength, message2) {
        return this._addCheck({
          kind: "min",
          value: minLength,
          ...errorUtil.errToObj(message2)
        });
      }
      max(maxLength, message2) {
        return this._addCheck({
          kind: "max",
          value: maxLength,
          ...errorUtil.errToObj(message2)
        });
      }
      length(len, message2) {
        return this._addCheck({
          kind: "length",
          value: len,
          ...errorUtil.errToObj(message2)
        });
      }
      /**
       * Equivalent to `.min(1)`
       */
      nonempty(message2) {
        return this.min(1, errorUtil.errToObj(message2));
      }
      trim() {
        return new _ZodString({
          ...this._def,
          checks: [...this._def.checks, { kind: "trim" }]
        });
      }
      toLowerCase() {
        return new _ZodString({
          ...this._def,
          checks: [...this._def.checks, { kind: "toLowerCase" }]
        });
      }
      toUpperCase() {
        return new _ZodString({
          ...this._def,
          checks: [...this._def.checks, { kind: "toUpperCase" }]
        });
      }
      get isDatetime() {
        return !!this._def.checks.find((ch) => ch.kind === "datetime");
      }
      get isDate() {
        return !!this._def.checks.find((ch) => ch.kind === "date");
      }
      get isTime() {
        return !!this._def.checks.find((ch) => ch.kind === "time");
      }
      get isDuration() {
        return !!this._def.checks.find((ch) => ch.kind === "duration");
      }
      get isEmail() {
        return !!this._def.checks.find((ch) => ch.kind === "email");
      }
      get isURL() {
        return !!this._def.checks.find((ch) => ch.kind === "url");
      }
      get isEmoji() {
        return !!this._def.checks.find((ch) => ch.kind === "emoji");
      }
      get isUUID() {
        return !!this._def.checks.find((ch) => ch.kind === "uuid");
      }
      get isNANOID() {
        return !!this._def.checks.find((ch) => ch.kind === "nanoid");
      }
      get isCUID() {
        return !!this._def.checks.find((ch) => ch.kind === "cuid");
      }
      get isCUID2() {
        return !!this._def.checks.find((ch) => ch.kind === "cuid2");
      }
      get isULID() {
        return !!this._def.checks.find((ch) => ch.kind === "ulid");
      }
      get isIP() {
        return !!this._def.checks.find((ch) => ch.kind === "ip");
      }
      get isCIDR() {
        return !!this._def.checks.find((ch) => ch.kind === "cidr");
      }
      get isBase64() {
        return !!this._def.checks.find((ch) => ch.kind === "base64");
      }
      get isBase64url() {
        return !!this._def.checks.find((ch) => ch.kind === "base64url");
      }
      get minLength() {
        let min = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "min") {
            if (min === null || ch.value > min)
              min = ch.value;
          }
        }
        return min;
      }
      get maxLength() {
        let max = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "max") {
            if (max === null || ch.value < max)
              max = ch.value;
          }
        }
        return max;
      }
    };
    ZodString.create = (params) => {
      return new ZodString({
        checks: [],
        typeName: ZodFirstPartyTypeKind.ZodString,
        coerce: params?.coerce ?? false,
        ...processCreateParams(params)
      });
    };
    ZodNumber = class _ZodNumber extends ZodType {
      constructor() {
        super(...arguments);
        this.min = this.gte;
        this.max = this.lte;
        this.step = this.multipleOf;
      }
      _parse(input) {
        if (this._def.coerce) {
          input.data = Number(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.number) {
          const ctx2 = this._getOrReturnCtx(input);
          addIssueToContext(ctx2, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.number,
            received: ctx2.parsedType
          });
          return INVALID;
        }
        let ctx = void 0;
        const status = new ParseStatus();
        for (const check of this._def.checks) {
          if (check.kind === "int") {
            if (!util.isInteger(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: "integer",
                received: "float",
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "min") {
            const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
            if (tooSmall) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_small,
                minimum: check.value,
                type: "number",
                inclusive: check.inclusive,
                exact: false,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "max") {
            const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
            if (tooBig) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_big,
                maximum: check.value,
                type: "number",
                inclusive: check.inclusive,
                exact: false,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "multipleOf") {
            if (floatSafeRemainder(input.data, check.value) !== 0) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.not_multiple_of,
                multipleOf: check.value,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "finite") {
            if (!Number.isFinite(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.not_finite,
                message: check.message
              });
              status.dirty();
            }
          } else {
            util.assertNever(check);
          }
        }
        return { status: status.value, value: input.data };
      }
      gte(value, message2) {
        return this.setLimit("min", value, true, errorUtil.toString(message2));
      }
      gt(value, message2) {
        return this.setLimit("min", value, false, errorUtil.toString(message2));
      }
      lte(value, message2) {
        return this.setLimit("max", value, true, errorUtil.toString(message2));
      }
      lt(value, message2) {
        return this.setLimit("max", value, false, errorUtil.toString(message2));
      }
      setLimit(kind, value, inclusive, message2) {
        return new _ZodNumber({
          ...this._def,
          checks: [
            ...this._def.checks,
            {
              kind,
              value,
              inclusive,
              message: errorUtil.toString(message2)
            }
          ]
        });
      }
      _addCheck(check) {
        return new _ZodNumber({
          ...this._def,
          checks: [...this._def.checks, check]
        });
      }
      int(message2) {
        return this._addCheck({
          kind: "int",
          message: errorUtil.toString(message2)
        });
      }
      positive(message2) {
        return this._addCheck({
          kind: "min",
          value: 0,
          inclusive: false,
          message: errorUtil.toString(message2)
        });
      }
      negative(message2) {
        return this._addCheck({
          kind: "max",
          value: 0,
          inclusive: false,
          message: errorUtil.toString(message2)
        });
      }
      nonpositive(message2) {
        return this._addCheck({
          kind: "max",
          value: 0,
          inclusive: true,
          message: errorUtil.toString(message2)
        });
      }
      nonnegative(message2) {
        return this._addCheck({
          kind: "min",
          value: 0,
          inclusive: true,
          message: errorUtil.toString(message2)
        });
      }
      multipleOf(value, message2) {
        return this._addCheck({
          kind: "multipleOf",
          value,
          message: errorUtil.toString(message2)
        });
      }
      finite(message2) {
        return this._addCheck({
          kind: "finite",
          message: errorUtil.toString(message2)
        });
      }
      safe(message2) {
        return this._addCheck({
          kind: "min",
          inclusive: true,
          value: Number.MIN_SAFE_INTEGER,
          message: errorUtil.toString(message2)
        })._addCheck({
          kind: "max",
          inclusive: true,
          value: Number.MAX_SAFE_INTEGER,
          message: errorUtil.toString(message2)
        });
      }
      get minValue() {
        let min = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "min") {
            if (min === null || ch.value > min)
              min = ch.value;
          }
        }
        return min;
      }
      get maxValue() {
        let max = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "max") {
            if (max === null || ch.value < max)
              max = ch.value;
          }
        }
        return max;
      }
      get isInt() {
        return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
      }
      get isFinite() {
        let max = null;
        let min = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
            return true;
          } else if (ch.kind === "min") {
            if (min === null || ch.value > min)
              min = ch.value;
          } else if (ch.kind === "max") {
            if (max === null || ch.value < max)
              max = ch.value;
          }
        }
        return Number.isFinite(min) && Number.isFinite(max);
      }
    };
    ZodNumber.create = (params) => {
      return new ZodNumber({
        checks: [],
        typeName: ZodFirstPartyTypeKind.ZodNumber,
        coerce: params?.coerce || false,
        ...processCreateParams(params)
      });
    };
    ZodBigInt = class _ZodBigInt extends ZodType {
      constructor() {
        super(...arguments);
        this.min = this.gte;
        this.max = this.lte;
      }
      _parse(input) {
        if (this._def.coerce) {
          try {
            input.data = BigInt(input.data);
          } catch {
            return this._getInvalidInput(input);
          }
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.bigint) {
          return this._getInvalidInput(input);
        }
        let ctx = void 0;
        const status = new ParseStatus();
        for (const check of this._def.checks) {
          if (check.kind === "min") {
            const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
            if (tooSmall) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_small,
                type: "bigint",
                minimum: check.value,
                inclusive: check.inclusive,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "max") {
            const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
            if (tooBig) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_big,
                type: "bigint",
                maximum: check.value,
                inclusive: check.inclusive,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "multipleOf") {
            if (input.data % check.value !== BigInt(0)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.not_multiple_of,
                multipleOf: check.value,
                message: check.message
              });
              status.dirty();
            }
          } else {
            util.assertNever(check);
          }
        }
        return { status: status.value, value: input.data };
      }
      _getInvalidInput(input) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.bigint,
          received: ctx.parsedType
        });
        return INVALID;
      }
      gte(value, message2) {
        return this.setLimit("min", value, true, errorUtil.toString(message2));
      }
      gt(value, message2) {
        return this.setLimit("min", value, false, errorUtil.toString(message2));
      }
      lte(value, message2) {
        return this.setLimit("max", value, true, errorUtil.toString(message2));
      }
      lt(value, message2) {
        return this.setLimit("max", value, false, errorUtil.toString(message2));
      }
      setLimit(kind, value, inclusive, message2) {
        return new _ZodBigInt({
          ...this._def,
          checks: [
            ...this._def.checks,
            {
              kind,
              value,
              inclusive,
              message: errorUtil.toString(message2)
            }
          ]
        });
      }
      _addCheck(check) {
        return new _ZodBigInt({
          ...this._def,
          checks: [...this._def.checks, check]
        });
      }
      positive(message2) {
        return this._addCheck({
          kind: "min",
          value: BigInt(0),
          inclusive: false,
          message: errorUtil.toString(message2)
        });
      }
      negative(message2) {
        return this._addCheck({
          kind: "max",
          value: BigInt(0),
          inclusive: false,
          message: errorUtil.toString(message2)
        });
      }
      nonpositive(message2) {
        return this._addCheck({
          kind: "max",
          value: BigInt(0),
          inclusive: true,
          message: errorUtil.toString(message2)
        });
      }
      nonnegative(message2) {
        return this._addCheck({
          kind: "min",
          value: BigInt(0),
          inclusive: true,
          message: errorUtil.toString(message2)
        });
      }
      multipleOf(value, message2) {
        return this._addCheck({
          kind: "multipleOf",
          value,
          message: errorUtil.toString(message2)
        });
      }
      get minValue() {
        let min = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "min") {
            if (min === null || ch.value > min)
              min = ch.value;
          }
        }
        return min;
      }
      get maxValue() {
        let max = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "max") {
            if (max === null || ch.value < max)
              max = ch.value;
          }
        }
        return max;
      }
    };
    ZodBigInt.create = (params) => {
      return new ZodBigInt({
        checks: [],
        typeName: ZodFirstPartyTypeKind.ZodBigInt,
        coerce: params?.coerce ?? false,
        ...processCreateParams(params)
      });
    };
    ZodBoolean = class extends ZodType {
      _parse(input) {
        if (this._def.coerce) {
          input.data = Boolean(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.boolean) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.boolean,
            received: ctx.parsedType
          });
          return INVALID;
        }
        return OK(input.data);
      }
    };
    ZodBoolean.create = (params) => {
      return new ZodBoolean({
        typeName: ZodFirstPartyTypeKind.ZodBoolean,
        coerce: params?.coerce || false,
        ...processCreateParams(params)
      });
    };
    ZodDate = class _ZodDate extends ZodType {
      _parse(input) {
        if (this._def.coerce) {
          input.data = new Date(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.date) {
          const ctx2 = this._getOrReturnCtx(input);
          addIssueToContext(ctx2, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.date,
            received: ctx2.parsedType
          });
          return INVALID;
        }
        if (Number.isNaN(input.data.getTime())) {
          const ctx2 = this._getOrReturnCtx(input);
          addIssueToContext(ctx2, {
            code: ZodIssueCode.invalid_date
          });
          return INVALID;
        }
        const status = new ParseStatus();
        let ctx = void 0;
        for (const check of this._def.checks) {
          if (check.kind === "min") {
            if (input.data.getTime() < check.value) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_small,
                message: check.message,
                inclusive: true,
                exact: false,
                minimum: check.value,
                type: "date"
              });
              status.dirty();
            }
          } else if (check.kind === "max") {
            if (input.data.getTime() > check.value) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_big,
                message: check.message,
                inclusive: true,
                exact: false,
                maximum: check.value,
                type: "date"
              });
              status.dirty();
            }
          } else {
            util.assertNever(check);
          }
        }
        return {
          status: status.value,
          value: new Date(input.data.getTime())
        };
      }
      _addCheck(check) {
        return new _ZodDate({
          ...this._def,
          checks: [...this._def.checks, check]
        });
      }
      min(minDate, message2) {
        return this._addCheck({
          kind: "min",
          value: minDate.getTime(),
          message: errorUtil.toString(message2)
        });
      }
      max(maxDate, message2) {
        return this._addCheck({
          kind: "max",
          value: maxDate.getTime(),
          message: errorUtil.toString(message2)
        });
      }
      get minDate() {
        let min = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "min") {
            if (min === null || ch.value > min)
              min = ch.value;
          }
        }
        return min != null ? new Date(min) : null;
      }
      get maxDate() {
        let max = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "max") {
            if (max === null || ch.value < max)
              max = ch.value;
          }
        }
        return max != null ? new Date(max) : null;
      }
    };
    ZodDate.create = (params) => {
      return new ZodDate({
        checks: [],
        coerce: params?.coerce || false,
        typeName: ZodFirstPartyTypeKind.ZodDate,
        ...processCreateParams(params)
      });
    };
    ZodSymbol = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.symbol) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.symbol,
            received: ctx.parsedType
          });
          return INVALID;
        }
        return OK(input.data);
      }
    };
    ZodSymbol.create = (params) => {
      return new ZodSymbol({
        typeName: ZodFirstPartyTypeKind.ZodSymbol,
        ...processCreateParams(params)
      });
    };
    ZodUndefined = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.undefined) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.undefined,
            received: ctx.parsedType
          });
          return INVALID;
        }
        return OK(input.data);
      }
    };
    ZodUndefined.create = (params) => {
      return new ZodUndefined({
        typeName: ZodFirstPartyTypeKind.ZodUndefined,
        ...processCreateParams(params)
      });
    };
    ZodNull = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.null) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.null,
            received: ctx.parsedType
          });
          return INVALID;
        }
        return OK(input.data);
      }
    };
    ZodNull.create = (params) => {
      return new ZodNull({
        typeName: ZodFirstPartyTypeKind.ZodNull,
        ...processCreateParams(params)
      });
    };
    ZodAny = class extends ZodType {
      constructor() {
        super(...arguments);
        this._any = true;
      }
      _parse(input) {
        return OK(input.data);
      }
    };
    ZodAny.create = (params) => {
      return new ZodAny({
        typeName: ZodFirstPartyTypeKind.ZodAny,
        ...processCreateParams(params)
      });
    };
    ZodUnknown = class extends ZodType {
      constructor() {
        super(...arguments);
        this._unknown = true;
      }
      _parse(input) {
        return OK(input.data);
      }
    };
    ZodUnknown.create = (params) => {
      return new ZodUnknown({
        typeName: ZodFirstPartyTypeKind.ZodUnknown,
        ...processCreateParams(params)
      });
    };
    ZodNever = class extends ZodType {
      _parse(input) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.never,
          received: ctx.parsedType
        });
        return INVALID;
      }
    };
    ZodNever.create = (params) => {
      return new ZodNever({
        typeName: ZodFirstPartyTypeKind.ZodNever,
        ...processCreateParams(params)
      });
    };
    ZodVoid = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.undefined) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.void,
            received: ctx.parsedType
          });
          return INVALID;
        }
        return OK(input.data);
      }
    };
    ZodVoid.create = (params) => {
      return new ZodVoid({
        typeName: ZodFirstPartyTypeKind.ZodVoid,
        ...processCreateParams(params)
      });
    };
    ZodArray = class _ZodArray extends ZodType {
      _parse(input) {
        const { ctx, status } = this._processInputParams(input);
        const def = this._def;
        if (ctx.parsedType !== ZodParsedType.array) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.array,
            received: ctx.parsedType
          });
          return INVALID;
        }
        if (def.exactLength !== null) {
          const tooBig = ctx.data.length > def.exactLength.value;
          const tooSmall = ctx.data.length < def.exactLength.value;
          if (tooBig || tooSmall) {
            addIssueToContext(ctx, {
              code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
              minimum: tooSmall ? def.exactLength.value : void 0,
              maximum: tooBig ? def.exactLength.value : void 0,
              type: "array",
              inclusive: true,
              exact: true,
              message: def.exactLength.message
            });
            status.dirty();
          }
        }
        if (def.minLength !== null) {
          if (ctx.data.length < def.minLength.value) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: def.minLength.value,
              type: "array",
              inclusive: true,
              exact: false,
              message: def.minLength.message
            });
            status.dirty();
          }
        }
        if (def.maxLength !== null) {
          if (ctx.data.length > def.maxLength.value) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: def.maxLength.value,
              type: "array",
              inclusive: true,
              exact: false,
              message: def.maxLength.message
            });
            status.dirty();
          }
        }
        if (ctx.common.async) {
          return Promise.all([...ctx.data].map((item, i) => {
            return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
          })).then((result2) => {
            return ParseStatus.mergeArray(status, result2);
          });
        }
        const result = [...ctx.data].map((item, i) => {
          return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
        });
        return ParseStatus.mergeArray(status, result);
      }
      get element() {
        return this._def.type;
      }
      min(minLength, message2) {
        return new _ZodArray({
          ...this._def,
          minLength: { value: minLength, message: errorUtil.toString(message2) }
        });
      }
      max(maxLength, message2) {
        return new _ZodArray({
          ...this._def,
          maxLength: { value: maxLength, message: errorUtil.toString(message2) }
        });
      }
      length(len, message2) {
        return new _ZodArray({
          ...this._def,
          exactLength: { value: len, message: errorUtil.toString(message2) }
        });
      }
      nonempty(message2) {
        return this.min(1, message2);
      }
    };
    ZodArray.create = (schema9, params) => {
      return new ZodArray({
        type: schema9,
        minLength: null,
        maxLength: null,
        exactLength: null,
        typeName: ZodFirstPartyTypeKind.ZodArray,
        ...processCreateParams(params)
      });
    };
    ZodObject = class _ZodObject extends ZodType {
      constructor() {
        super(...arguments);
        this._cached = null;
        this.nonstrict = this.passthrough;
        this.augment = this.extend;
      }
      _getCached() {
        if (this._cached !== null)
          return this._cached;
        const shape = this._def.shape();
        const keys = util.objectKeys(shape);
        this._cached = { shape, keys };
        return this._cached;
      }
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.object) {
          const ctx2 = this._getOrReturnCtx(input);
          addIssueToContext(ctx2, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.object,
            received: ctx2.parsedType
          });
          return INVALID;
        }
        const { status, ctx } = this._processInputParams(input);
        const { shape, keys: shapeKeys } = this._getCached();
        const extraKeys = [];
        if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
          for (const key in ctx.data) {
            if (!shapeKeys.includes(key)) {
              extraKeys.push(key);
            }
          }
        }
        const pairs = [];
        for (const key of shapeKeys) {
          const keyValidator = shape[key];
          const value = ctx.data[key];
          pairs.push({
            key: { status: "valid", value: key },
            value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
            alwaysSet: key in ctx.data
          });
        }
        if (this._def.catchall instanceof ZodNever) {
          const unknownKeys = this._def.unknownKeys;
          if (unknownKeys === "passthrough") {
            for (const key of extraKeys) {
              pairs.push({
                key: { status: "valid", value: key },
                value: { status: "valid", value: ctx.data[key] }
              });
            }
          } else if (unknownKeys === "strict") {
            if (extraKeys.length > 0) {
              addIssueToContext(ctx, {
                code: ZodIssueCode.unrecognized_keys,
                keys: extraKeys
              });
              status.dirty();
            }
          } else if (unknownKeys === "strip") {
          } else {
            throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
          }
        } else {
          const catchall = this._def.catchall;
          for (const key of extraKeys) {
            const value = ctx.data[key];
            pairs.push({
              key: { status: "valid", value: key },
              value: catchall._parse(
                new ParseInputLazyPath(ctx, value, ctx.path, key)
                //, ctx.child(key), value, getParsedType(value)
              ),
              alwaysSet: key in ctx.data
            });
          }
        }
        if (ctx.common.async) {
          return Promise.resolve().then(async () => {
            const syncPairs = [];
            for (const pair of pairs) {
              const key = await pair.key;
              const value = await pair.value;
              syncPairs.push({
                key,
                value,
                alwaysSet: pair.alwaysSet
              });
            }
            return syncPairs;
          }).then((syncPairs) => {
            return ParseStatus.mergeObjectSync(status, syncPairs);
          });
        } else {
          return ParseStatus.mergeObjectSync(status, pairs);
        }
      }
      get shape() {
        return this._def.shape();
      }
      strict(message2) {
        errorUtil.errToObj;
        return new _ZodObject({
          ...this._def,
          unknownKeys: "strict",
          ...message2 !== void 0 ? {
            errorMap: (issue, ctx) => {
              const defaultError = this._def.errorMap?.(issue, ctx).message ?? ctx.defaultError;
              if (issue.code === "unrecognized_keys")
                return {
                  message: errorUtil.errToObj(message2).message ?? defaultError
                };
              return {
                message: defaultError
              };
            }
          } : {}
        });
      }
      strip() {
        return new _ZodObject({
          ...this._def,
          unknownKeys: "strip"
        });
      }
      passthrough() {
        return new _ZodObject({
          ...this._def,
          unknownKeys: "passthrough"
        });
      }
      // const AugmentFactory =
      //   <Def extends ZodObjectDef>(def: Def) =>
      //   <Augmentation extends ZodRawShape>(
      //     augmentation: Augmentation
      //   ): ZodObject<
      //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
      //     Def["unknownKeys"],
      //     Def["catchall"]
      //   > => {
      //     return new ZodObject({
      //       ...def,
      //       shape: () => ({
      //         ...def.shape(),
      //         ...augmentation,
      //       }),
      //     }) as any;
      //   };
      extend(augmentation) {
        return new _ZodObject({
          ...this._def,
          shape: () => ({
            ...this._def.shape(),
            ...augmentation
          })
        });
      }
      /**
       * Prior to zod@1.0.12 there was a bug in the
       * inferred type of merged objects. Please
       * upgrade if you are experiencing issues.
       */
      merge(merging) {
        const merged = new _ZodObject({
          unknownKeys: merging._def.unknownKeys,
          catchall: merging._def.catchall,
          shape: () => ({
            ...this._def.shape(),
            ...merging._def.shape()
          }),
          typeName: ZodFirstPartyTypeKind.ZodObject
        });
        return merged;
      }
      // merge<
      //   Incoming extends AnyZodObject,
      //   Augmentation extends Incoming["shape"],
      //   NewOutput extends {
      //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
      //       ? Augmentation[k]["_output"]
      //       : k extends keyof Output
      //       ? Output[k]
      //       : never;
      //   },
      //   NewInput extends {
      //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
      //       ? Augmentation[k]["_input"]
      //       : k extends keyof Input
      //       ? Input[k]
      //       : never;
      //   }
      // >(
      //   merging: Incoming
      // ): ZodObject<
      //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
      //   Incoming["_def"]["unknownKeys"],
      //   Incoming["_def"]["catchall"],
      //   NewOutput,
      //   NewInput
      // > {
      //   const merged: any = new ZodObject({
      //     unknownKeys: merging._def.unknownKeys,
      //     catchall: merging._def.catchall,
      //     shape: () =>
      //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
      //     typeName: ZodFirstPartyTypeKind.ZodObject,
      //   }) as any;
      //   return merged;
      // }
      setKey(key, schema9) {
        return this.augment({ [key]: schema9 });
      }
      // merge<Incoming extends AnyZodObject>(
      //   merging: Incoming
      // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
      // ZodObject<
      //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
      //   Incoming["_def"]["unknownKeys"],
      //   Incoming["_def"]["catchall"]
      // > {
      //   // const mergedShape = objectUtil.mergeShapes(
      //   //   this._def.shape(),
      //   //   merging._def.shape()
      //   // );
      //   const merged: any = new ZodObject({
      //     unknownKeys: merging._def.unknownKeys,
      //     catchall: merging._def.catchall,
      //     shape: () =>
      //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
      //     typeName: ZodFirstPartyTypeKind.ZodObject,
      //   }) as any;
      //   return merged;
      // }
      catchall(index) {
        return new _ZodObject({
          ...this._def,
          catchall: index
        });
      }
      pick(mask) {
        const shape = {};
        for (const key of util.objectKeys(mask)) {
          if (mask[key] && this.shape[key]) {
            shape[key] = this.shape[key];
          }
        }
        return new _ZodObject({
          ...this._def,
          shape: () => shape
        });
      }
      omit(mask) {
        const shape = {};
        for (const key of util.objectKeys(this.shape)) {
          if (!mask[key]) {
            shape[key] = this.shape[key];
          }
        }
        return new _ZodObject({
          ...this._def,
          shape: () => shape
        });
      }
      /**
       * @deprecated
       */
      deepPartial() {
        return deepPartialify(this);
      }
      partial(mask) {
        const newShape = {};
        for (const key of util.objectKeys(this.shape)) {
          const fieldSchema = this.shape[key];
          if (mask && !mask[key]) {
            newShape[key] = fieldSchema;
          } else {
            newShape[key] = fieldSchema.optional();
          }
        }
        return new _ZodObject({
          ...this._def,
          shape: () => newShape
        });
      }
      required(mask) {
        const newShape = {};
        for (const key of util.objectKeys(this.shape)) {
          if (mask && !mask[key]) {
            newShape[key] = this.shape[key];
          } else {
            const fieldSchema = this.shape[key];
            let newField = fieldSchema;
            while (newField instanceof ZodOptional) {
              newField = newField._def.innerType;
            }
            newShape[key] = newField;
          }
        }
        return new _ZodObject({
          ...this._def,
          shape: () => newShape
        });
      }
      keyof() {
        return createZodEnum(util.objectKeys(this.shape));
      }
    };
    ZodObject.create = (shape, params) => {
      return new ZodObject({
        shape: () => shape,
        unknownKeys: "strip",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params)
      });
    };
    ZodObject.strictCreate = (shape, params) => {
      return new ZodObject({
        shape: () => shape,
        unknownKeys: "strict",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params)
      });
    };
    ZodObject.lazycreate = (shape, params) => {
      return new ZodObject({
        shape,
        unknownKeys: "strip",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params)
      });
    };
    ZodUnion = class extends ZodType {
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        const options = this._def.options;
        function handleResults(results) {
          for (const result of results) {
            if (result.result.status === "valid") {
              return result.result;
            }
          }
          for (const result of results) {
            if (result.result.status === "dirty") {
              ctx.common.issues.push(...result.ctx.common.issues);
              return result.result;
            }
          }
          const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_union,
            unionErrors
          });
          return INVALID;
        }
        if (ctx.common.async) {
          return Promise.all(options.map(async (option) => {
            const childCtx = {
              ...ctx,
              common: {
                ...ctx.common,
                issues: []
              },
              parent: null
            };
            return {
              result: await option._parseAsync({
                data: ctx.data,
                path: ctx.path,
                parent: childCtx
              }),
              ctx: childCtx
            };
          })).then(handleResults);
        } else {
          let dirty = void 0;
          const issues = [];
          for (const option of options) {
            const childCtx = {
              ...ctx,
              common: {
                ...ctx.common,
                issues: []
              },
              parent: null
            };
            const result = option._parseSync({
              data: ctx.data,
              path: ctx.path,
              parent: childCtx
            });
            if (result.status === "valid") {
              return result;
            } else if (result.status === "dirty" && !dirty) {
              dirty = { result, ctx: childCtx };
            }
            if (childCtx.common.issues.length) {
              issues.push(childCtx.common.issues);
            }
          }
          if (dirty) {
            ctx.common.issues.push(...dirty.ctx.common.issues);
            return dirty.result;
          }
          const unionErrors = issues.map((issues2) => new ZodError(issues2));
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_union,
            unionErrors
          });
          return INVALID;
        }
      }
      get options() {
        return this._def.options;
      }
    };
    ZodUnion.create = (types, params) => {
      return new ZodUnion({
        options: types,
        typeName: ZodFirstPartyTypeKind.ZodUnion,
        ...processCreateParams(params)
      });
    };
    getDiscriminator = (type) => {
      if (type instanceof ZodLazy) {
        return getDiscriminator(type.schema);
      } else if (type instanceof ZodEffects) {
        return getDiscriminator(type.innerType());
      } else if (type instanceof ZodLiteral) {
        return [type.value];
      } else if (type instanceof ZodEnum) {
        return type.options;
      } else if (type instanceof ZodNativeEnum) {
        return util.objectValues(type.enum);
      } else if (type instanceof ZodDefault) {
        return getDiscriminator(type._def.innerType);
      } else if (type instanceof ZodUndefined) {
        return [void 0];
      } else if (type instanceof ZodNull) {
        return [null];
      } else if (type instanceof ZodOptional) {
        return [void 0, ...getDiscriminator(type.unwrap())];
      } else if (type instanceof ZodNullable) {
        return [null, ...getDiscriminator(type.unwrap())];
      } else if (type instanceof ZodBranded) {
        return getDiscriminator(type.unwrap());
      } else if (type instanceof ZodReadonly) {
        return getDiscriminator(type.unwrap());
      } else if (type instanceof ZodCatch) {
        return getDiscriminator(type._def.innerType);
      } else {
        return [];
      }
    };
    ZodDiscriminatedUnion = class _ZodDiscriminatedUnion extends ZodType {
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.object) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.object,
            received: ctx.parsedType
          });
          return INVALID;
        }
        const discriminator = this.discriminator;
        const discriminatorValue = ctx.data[discriminator];
        const option = this.optionsMap.get(discriminatorValue);
        if (!option) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_union_discriminator,
            options: Array.from(this.optionsMap.keys()),
            path: [discriminator]
          });
          return INVALID;
        }
        if (ctx.common.async) {
          return option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
        } else {
          return option._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
        }
      }
      get discriminator() {
        return this._def.discriminator;
      }
      get options() {
        return this._def.options;
      }
      get optionsMap() {
        return this._def.optionsMap;
      }
      /**
       * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
       * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
       * have a different value for each object in the union.
       * @param discriminator the name of the discriminator property
       * @param types an array of object schemas
       * @param params
       */
      static create(discriminator, options, params) {
        const optionsMap = /* @__PURE__ */ new Map();
        for (const type of options) {
          const discriminatorValues = getDiscriminator(type.shape[discriminator]);
          if (!discriminatorValues.length) {
            throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
          }
          for (const value of discriminatorValues) {
            if (optionsMap.has(value)) {
              throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
            }
            optionsMap.set(value, type);
          }
        }
        return new _ZodDiscriminatedUnion({
          typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
          discriminator,
          options,
          optionsMap,
          ...processCreateParams(params)
        });
      }
    };
    ZodIntersection = class extends ZodType {
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        const handleParsed = (parsedLeft, parsedRight) => {
          if (isAborted(parsedLeft) || isAborted(parsedRight)) {
            return INVALID;
          }
          const merged = mergeValues(parsedLeft.value, parsedRight.value);
          if (!merged.valid) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_intersection_types
            });
            return INVALID;
          }
          if (isDirty(parsedLeft) || isDirty(parsedRight)) {
            status.dirty();
          }
          return { status: status.value, value: merged.data };
        };
        if (ctx.common.async) {
          return Promise.all([
            this._def.left._parseAsync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            }),
            this._def.right._parseAsync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            })
          ]).then(([left, right]) => handleParsed(left, right));
        } else {
          return handleParsed(this._def.left._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          }), this._def.right._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          }));
        }
      }
    };
    ZodIntersection.create = (left, right, params) => {
      return new ZodIntersection({
        left,
        right,
        typeName: ZodFirstPartyTypeKind.ZodIntersection,
        ...processCreateParams(params)
      });
    };
    ZodTuple = class _ZodTuple extends ZodType {
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.array) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.array,
            received: ctx.parsedType
          });
          return INVALID;
        }
        if (ctx.data.length < this._def.items.length) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: this._def.items.length,
            inclusive: true,
            exact: false,
            type: "array"
          });
          return INVALID;
        }
        const rest = this._def.rest;
        if (!rest && ctx.data.length > this._def.items.length) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: this._def.items.length,
            inclusive: true,
            exact: false,
            type: "array"
          });
          status.dirty();
        }
        const items = [...ctx.data].map((item, itemIndex) => {
          const schema9 = this._def.items[itemIndex] || this._def.rest;
          if (!schema9)
            return null;
          return schema9._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
        }).filter((x) => !!x);
        if (ctx.common.async) {
          return Promise.all(items).then((results) => {
            return ParseStatus.mergeArray(status, results);
          });
        } else {
          return ParseStatus.mergeArray(status, items);
        }
      }
      get items() {
        return this._def.items;
      }
      rest(rest) {
        return new _ZodTuple({
          ...this._def,
          rest
        });
      }
    };
    ZodTuple.create = (schemas, params) => {
      if (!Array.isArray(schemas)) {
        throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
      }
      return new ZodTuple({
        items: schemas,
        typeName: ZodFirstPartyTypeKind.ZodTuple,
        rest: null,
        ...processCreateParams(params)
      });
    };
    ZodRecord = class _ZodRecord extends ZodType {
      get keySchema() {
        return this._def.keyType;
      }
      get valueSchema() {
        return this._def.valueType;
      }
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.object) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.object,
            received: ctx.parsedType
          });
          return INVALID;
        }
        const pairs = [];
        const keyType = this._def.keyType;
        const valueType = this._def.valueType;
        for (const key in ctx.data) {
          pairs.push({
            key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
            value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
            alwaysSet: key in ctx.data
          });
        }
        if (ctx.common.async) {
          return ParseStatus.mergeObjectAsync(status, pairs);
        } else {
          return ParseStatus.mergeObjectSync(status, pairs);
        }
      }
      get element() {
        return this._def.valueType;
      }
      static create(first, second, third) {
        if (second instanceof ZodType) {
          return new _ZodRecord({
            keyType: first,
            valueType: second,
            typeName: ZodFirstPartyTypeKind.ZodRecord,
            ...processCreateParams(third)
          });
        }
        return new _ZodRecord({
          keyType: ZodString.create(),
          valueType: first,
          typeName: ZodFirstPartyTypeKind.ZodRecord,
          ...processCreateParams(second)
        });
      }
    };
    ZodMap = class extends ZodType {
      get keySchema() {
        return this._def.keyType;
      }
      get valueSchema() {
        return this._def.valueType;
      }
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.map) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.map,
            received: ctx.parsedType
          });
          return INVALID;
        }
        const keyType = this._def.keyType;
        const valueType = this._def.valueType;
        const pairs = [...ctx.data.entries()].map(([key, value], index) => {
          return {
            key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
            value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
          };
        });
        if (ctx.common.async) {
          const finalMap = /* @__PURE__ */ new Map();
          return Promise.resolve().then(async () => {
            for (const pair of pairs) {
              const key = await pair.key;
              const value = await pair.value;
              if (key.status === "aborted" || value.status === "aborted") {
                return INVALID;
              }
              if (key.status === "dirty" || value.status === "dirty") {
                status.dirty();
              }
              finalMap.set(key.value, value.value);
            }
            return { status: status.value, value: finalMap };
          });
        } else {
          const finalMap = /* @__PURE__ */ new Map();
          for (const pair of pairs) {
            const key = pair.key;
            const value = pair.value;
            if (key.status === "aborted" || value.status === "aborted") {
              return INVALID;
            }
            if (key.status === "dirty" || value.status === "dirty") {
              status.dirty();
            }
            finalMap.set(key.value, value.value);
          }
          return { status: status.value, value: finalMap };
        }
      }
    };
    ZodMap.create = (keyType, valueType, params) => {
      return new ZodMap({
        valueType,
        keyType,
        typeName: ZodFirstPartyTypeKind.ZodMap,
        ...processCreateParams(params)
      });
    };
    ZodSet = class _ZodSet extends ZodType {
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.set) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.set,
            received: ctx.parsedType
          });
          return INVALID;
        }
        const def = this._def;
        if (def.minSize !== null) {
          if (ctx.data.size < def.minSize.value) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: def.minSize.value,
              type: "set",
              inclusive: true,
              exact: false,
              message: def.minSize.message
            });
            status.dirty();
          }
        }
        if (def.maxSize !== null) {
          if (ctx.data.size > def.maxSize.value) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: def.maxSize.value,
              type: "set",
              inclusive: true,
              exact: false,
              message: def.maxSize.message
            });
            status.dirty();
          }
        }
        const valueType = this._def.valueType;
        function finalizeSet(elements2) {
          const parsedSet = /* @__PURE__ */ new Set();
          for (const element of elements2) {
            if (element.status === "aborted")
              return INVALID;
            if (element.status === "dirty")
              status.dirty();
            parsedSet.add(element.value);
          }
          return { status: status.value, value: parsedSet };
        }
        const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
        if (ctx.common.async) {
          return Promise.all(elements).then((elements2) => finalizeSet(elements2));
        } else {
          return finalizeSet(elements);
        }
      }
      min(minSize, message2) {
        return new _ZodSet({
          ...this._def,
          minSize: { value: minSize, message: errorUtil.toString(message2) }
        });
      }
      max(maxSize, message2) {
        return new _ZodSet({
          ...this._def,
          maxSize: { value: maxSize, message: errorUtil.toString(message2) }
        });
      }
      size(size, message2) {
        return this.min(size, message2).max(size, message2);
      }
      nonempty(message2) {
        return this.min(1, message2);
      }
    };
    ZodSet.create = (valueType, params) => {
      return new ZodSet({
        valueType,
        minSize: null,
        maxSize: null,
        typeName: ZodFirstPartyTypeKind.ZodSet,
        ...processCreateParams(params)
      });
    };
    ZodFunction = class _ZodFunction extends ZodType {
      constructor() {
        super(...arguments);
        this.validate = this.implement;
      }
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.function) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.function,
            received: ctx.parsedType
          });
          return INVALID;
        }
        function makeArgsIssue(args, error) {
          return makeIssue({
            data: args,
            path: ctx.path,
            errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
            issueData: {
              code: ZodIssueCode.invalid_arguments,
              argumentsError: error
            }
          });
        }
        function makeReturnsIssue(returns, error) {
          return makeIssue({
            data: returns,
            path: ctx.path,
            errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
            issueData: {
              code: ZodIssueCode.invalid_return_type,
              returnTypeError: error
            }
          });
        }
        const params = { errorMap: ctx.common.contextualErrorMap };
        const fn = ctx.data;
        if (this._def.returns instanceof ZodPromise) {
          const me = this;
          return OK(async function(...args) {
            const error = new ZodError([]);
            const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
              error.addIssue(makeArgsIssue(args, e));
              throw error;
            });
            const result = await Reflect.apply(fn, this, parsedArgs);
            const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
              error.addIssue(makeReturnsIssue(result, e));
              throw error;
            });
            return parsedReturns;
          });
        } else {
          const me = this;
          return OK(function(...args) {
            const parsedArgs = me._def.args.safeParse(args, params);
            if (!parsedArgs.success) {
              throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
            }
            const result = Reflect.apply(fn, this, parsedArgs.data);
            const parsedReturns = me._def.returns.safeParse(result, params);
            if (!parsedReturns.success) {
              throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
            }
            return parsedReturns.data;
          });
        }
      }
      parameters() {
        return this._def.args;
      }
      returnType() {
        return this._def.returns;
      }
      args(...items) {
        return new _ZodFunction({
          ...this._def,
          args: ZodTuple.create(items).rest(ZodUnknown.create())
        });
      }
      returns(returnType) {
        return new _ZodFunction({
          ...this._def,
          returns: returnType
        });
      }
      implement(func) {
        const validatedFunc = this.parse(func);
        return validatedFunc;
      }
      strictImplement(func) {
        const validatedFunc = this.parse(func);
        return validatedFunc;
      }
      static create(args, returns, params) {
        return new _ZodFunction({
          args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
          returns: returns || ZodUnknown.create(),
          typeName: ZodFirstPartyTypeKind.ZodFunction,
          ...processCreateParams(params)
        });
      }
    };
    ZodLazy = class extends ZodType {
      get schema() {
        return this._def.getter();
      }
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        const lazySchema = this._def.getter();
        return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
      }
    };
    ZodLazy.create = (getter, params) => {
      return new ZodLazy({
        getter,
        typeName: ZodFirstPartyTypeKind.ZodLazy,
        ...processCreateParams(params)
      });
    };
    ZodLiteral = class extends ZodType {
      _parse(input) {
        if (input.data !== this._def.value) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            received: ctx.data,
            code: ZodIssueCode.invalid_literal,
            expected: this._def.value
          });
          return INVALID;
        }
        return { status: "valid", value: input.data };
      }
      get value() {
        return this._def.value;
      }
    };
    ZodLiteral.create = (value, params) => {
      return new ZodLiteral({
        value,
        typeName: ZodFirstPartyTypeKind.ZodLiteral,
        ...processCreateParams(params)
      });
    };
    ZodEnum = class _ZodEnum extends ZodType {
      _parse(input) {
        if (typeof input.data !== "string") {
          const ctx = this._getOrReturnCtx(input);
          const expectedValues = this._def.values;
          addIssueToContext(ctx, {
            expected: util.joinValues(expectedValues),
            received: ctx.parsedType,
            code: ZodIssueCode.invalid_type
          });
          return INVALID;
        }
        if (!this._cache) {
          this._cache = new Set(this._def.values);
        }
        if (!this._cache.has(input.data)) {
          const ctx = this._getOrReturnCtx(input);
          const expectedValues = this._def.values;
          addIssueToContext(ctx, {
            received: ctx.data,
            code: ZodIssueCode.invalid_enum_value,
            options: expectedValues
          });
          return INVALID;
        }
        return OK(input.data);
      }
      get options() {
        return this._def.values;
      }
      get enum() {
        const enumValues = {};
        for (const val of this._def.values) {
          enumValues[val] = val;
        }
        return enumValues;
      }
      get Values() {
        const enumValues = {};
        for (const val of this._def.values) {
          enumValues[val] = val;
        }
        return enumValues;
      }
      get Enum() {
        const enumValues = {};
        for (const val of this._def.values) {
          enumValues[val] = val;
        }
        return enumValues;
      }
      extract(values, newDef = this._def) {
        return _ZodEnum.create(values, {
          ...this._def,
          ...newDef
        });
      }
      exclude(values, newDef = this._def) {
        return _ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
          ...this._def,
          ...newDef
        });
      }
    };
    ZodEnum.create = createZodEnum;
    ZodNativeEnum = class extends ZodType {
      _parse(input) {
        const nativeEnumValues = util.getValidEnumValues(this._def.values);
        const ctx = this._getOrReturnCtx(input);
        if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
          const expectedValues = util.objectValues(nativeEnumValues);
          addIssueToContext(ctx, {
            expected: util.joinValues(expectedValues),
            received: ctx.parsedType,
            code: ZodIssueCode.invalid_type
          });
          return INVALID;
        }
        if (!this._cache) {
          this._cache = new Set(util.getValidEnumValues(this._def.values));
        }
        if (!this._cache.has(input.data)) {
          const expectedValues = util.objectValues(nativeEnumValues);
          addIssueToContext(ctx, {
            received: ctx.data,
            code: ZodIssueCode.invalid_enum_value,
            options: expectedValues
          });
          return INVALID;
        }
        return OK(input.data);
      }
      get enum() {
        return this._def.values;
      }
    };
    ZodNativeEnum.create = (values, params) => {
      return new ZodNativeEnum({
        values,
        typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
        ...processCreateParams(params)
      });
    };
    ZodPromise = class extends ZodType {
      unwrap() {
        return this._def.type;
      }
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.promise,
            received: ctx.parsedType
          });
          return INVALID;
        }
        const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
        return OK(promisified.then((data) => {
          return this._def.type.parseAsync(data, {
            path: ctx.path,
            errorMap: ctx.common.contextualErrorMap
          });
        }));
      }
    };
    ZodPromise.create = (schema9, params) => {
      return new ZodPromise({
        type: schema9,
        typeName: ZodFirstPartyTypeKind.ZodPromise,
        ...processCreateParams(params)
      });
    };
    ZodEffects = class extends ZodType {
      innerType() {
        return this._def.schema;
      }
      sourceType() {
        return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
      }
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        const effect = this._def.effect || null;
        const checkCtx = {
          addIssue: (arg) => {
            addIssueToContext(ctx, arg);
            if (arg.fatal) {
              status.abort();
            } else {
              status.dirty();
            }
          },
          get path() {
            return ctx.path;
          }
        };
        checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
        if (effect.type === "preprocess") {
          const processed = effect.transform(ctx.data, checkCtx);
          if (ctx.common.async) {
            return Promise.resolve(processed).then(async (processed2) => {
              if (status.value === "aborted")
                return INVALID;
              const result = await this._def.schema._parseAsync({
                data: processed2,
                path: ctx.path,
                parent: ctx
              });
              if (result.status === "aborted")
                return INVALID;
              if (result.status === "dirty")
                return DIRTY(result.value);
              if (status.value === "dirty")
                return DIRTY(result.value);
              return result;
            });
          } else {
            if (status.value === "aborted")
              return INVALID;
            const result = this._def.schema._parseSync({
              data: processed,
              path: ctx.path,
              parent: ctx
            });
            if (result.status === "aborted")
              return INVALID;
            if (result.status === "dirty")
              return DIRTY(result.value);
            if (status.value === "dirty")
              return DIRTY(result.value);
            return result;
          }
        }
        if (effect.type === "refinement") {
          const executeRefinement = (acc) => {
            const result = effect.refinement(acc, checkCtx);
            if (ctx.common.async) {
              return Promise.resolve(result);
            }
            if (result instanceof Promise) {
              throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
            }
            return acc;
          };
          if (ctx.common.async === false) {
            const inner = this._def.schema._parseSync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            });
            if (inner.status === "aborted")
              return INVALID;
            if (inner.status === "dirty")
              status.dirty();
            executeRefinement(inner.value);
            return { status: status.value, value: inner.value };
          } else {
            return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
              if (inner.status === "aborted")
                return INVALID;
              if (inner.status === "dirty")
                status.dirty();
              return executeRefinement(inner.value).then(() => {
                return { status: status.value, value: inner.value };
              });
            });
          }
        }
        if (effect.type === "transform") {
          if (ctx.common.async === false) {
            const base = this._def.schema._parseSync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            });
            if (!isValid(base))
              return INVALID;
            const result = effect.transform(base.value, checkCtx);
            if (result instanceof Promise) {
              throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
            }
            return { status: status.value, value: result };
          } else {
            return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
              if (!isValid(base))
                return INVALID;
              return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
                status: status.value,
                value: result
              }));
            });
          }
        }
        util.assertNever(effect);
      }
    };
    ZodEffects.create = (schema9, effect, params) => {
      return new ZodEffects({
        schema: schema9,
        typeName: ZodFirstPartyTypeKind.ZodEffects,
        effect,
        ...processCreateParams(params)
      });
    };
    ZodEffects.createWithPreprocess = (preprocess, schema9, params) => {
      return new ZodEffects({
        schema: schema9,
        effect: { type: "preprocess", transform: preprocess },
        typeName: ZodFirstPartyTypeKind.ZodEffects,
        ...processCreateParams(params)
      });
    };
    ZodOptional = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType === ZodParsedType.undefined) {
          return OK(void 0);
        }
        return this._def.innerType._parse(input);
      }
      unwrap() {
        return this._def.innerType;
      }
    };
    ZodOptional.create = (type, params) => {
      return new ZodOptional({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodOptional,
        ...processCreateParams(params)
      });
    };
    ZodNullable = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType === ZodParsedType.null) {
          return OK(null);
        }
        return this._def.innerType._parse(input);
      }
      unwrap() {
        return this._def.innerType;
      }
    };
    ZodNullable.create = (type, params) => {
      return new ZodNullable({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodNullable,
        ...processCreateParams(params)
      });
    };
    ZodDefault = class extends ZodType {
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        let data = ctx.data;
        if (ctx.parsedType === ZodParsedType.undefined) {
          data = this._def.defaultValue();
        }
        return this._def.innerType._parse({
          data,
          path: ctx.path,
          parent: ctx
        });
      }
      removeDefault() {
        return this._def.innerType;
      }
    };
    ZodDefault.create = (type, params) => {
      return new ZodDefault({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodDefault,
        defaultValue: typeof params.default === "function" ? params.default : () => params.default,
        ...processCreateParams(params)
      });
    };
    ZodCatch = class extends ZodType {
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        const newCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          }
        };
        const result = this._def.innerType._parse({
          data: newCtx.data,
          path: newCtx.path,
          parent: {
            ...newCtx
          }
        });
        if (isAsync(result)) {
          return result.then((result2) => {
            return {
              status: "valid",
              value: result2.status === "valid" ? result2.value : this._def.catchValue({
                get error() {
                  return new ZodError(newCtx.common.issues);
                },
                input: newCtx.data
              })
            };
          });
        } else {
          return {
            status: "valid",
            value: result.status === "valid" ? result.value : this._def.catchValue({
              get error() {
                return new ZodError(newCtx.common.issues);
              },
              input: newCtx.data
            })
          };
        }
      }
      removeCatch() {
        return this._def.innerType;
      }
    };
    ZodCatch.create = (type, params) => {
      return new ZodCatch({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodCatch,
        catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
        ...processCreateParams(params)
      });
    };
    ZodNaN = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.nan) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.nan,
            received: ctx.parsedType
          });
          return INVALID;
        }
        return { status: "valid", value: input.data };
      }
    };
    ZodNaN.create = (params) => {
      return new ZodNaN({
        typeName: ZodFirstPartyTypeKind.ZodNaN,
        ...processCreateParams(params)
      });
    };
    BRAND = /* @__PURE__ */ Symbol("zod_brand");
    ZodBranded = class extends ZodType {
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        const data = ctx.data;
        return this._def.type._parse({
          data,
          path: ctx.path,
          parent: ctx
        });
      }
      unwrap() {
        return this._def.type;
      }
    };
    ZodPipeline = class _ZodPipeline extends ZodType {
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.common.async) {
          const handleAsync = async () => {
            const inResult = await this._def.in._parseAsync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            });
            if (inResult.status === "aborted")
              return INVALID;
            if (inResult.status === "dirty") {
              status.dirty();
              return DIRTY(inResult.value);
            } else {
              return this._def.out._parseAsync({
                data: inResult.value,
                path: ctx.path,
                parent: ctx
              });
            }
          };
          return handleAsync();
        } else {
          const inResult = this._def.in._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
          if (inResult.status === "aborted")
            return INVALID;
          if (inResult.status === "dirty") {
            status.dirty();
            return {
              status: "dirty",
              value: inResult.value
            };
          } else {
            return this._def.out._parseSync({
              data: inResult.value,
              path: ctx.path,
              parent: ctx
            });
          }
        }
      }
      static create(a, b) {
        return new _ZodPipeline({
          in: a,
          out: b,
          typeName: ZodFirstPartyTypeKind.ZodPipeline
        });
      }
    };
    ZodReadonly = class extends ZodType {
      _parse(input) {
        const result = this._def.innerType._parse(input);
        const freeze3 = (data) => {
          if (isValid(data)) {
            data.value = Object.freeze(data.value);
          }
          return data;
        };
        return isAsync(result) ? result.then((data) => freeze3(data)) : freeze3(result);
      }
      unwrap() {
        return this._def.innerType;
      }
    };
    ZodReadonly.create = (type, params) => {
      return new ZodReadonly({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodReadonly,
        ...processCreateParams(params)
      });
    };
    late = {
      object: ZodObject.lazycreate
    };
    (function(ZodFirstPartyTypeKind2) {
      ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
      ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
      ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
      ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
      ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
      ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
      ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
      ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
      ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
      ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
      ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
      ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
      ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
      ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
      ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
      ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
      ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
      ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
      ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
      ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
      ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
      ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
      ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
      ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
      ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
      ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
      ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
      ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
      ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
      ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
      ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
      ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
      ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
      ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
      ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
      ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
    })(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
    instanceOfType = (cls, params = {
      message: `Input not instance of ${cls.name}`
    }) => custom((data) => data instanceof cls, params);
    stringType = ZodString.create;
    numberType = ZodNumber.create;
    nanType = ZodNaN.create;
    bigIntType = ZodBigInt.create;
    booleanType = ZodBoolean.create;
    dateType = ZodDate.create;
    symbolType = ZodSymbol.create;
    undefinedType = ZodUndefined.create;
    nullType = ZodNull.create;
    anyType = ZodAny.create;
    unknownType = ZodUnknown.create;
    neverType = ZodNever.create;
    voidType = ZodVoid.create;
    arrayType = ZodArray.create;
    objectType = ZodObject.create;
    strictObjectType = ZodObject.strictCreate;
    unionType = ZodUnion.create;
    discriminatedUnionType = ZodDiscriminatedUnion.create;
    intersectionType = ZodIntersection.create;
    tupleType = ZodTuple.create;
    recordType = ZodRecord.create;
    mapType = ZodMap.create;
    setType = ZodSet.create;
    functionType = ZodFunction.create;
    lazyType = ZodLazy.create;
    literalType = ZodLiteral.create;
    enumType = ZodEnum.create;
    nativeEnumType = ZodNativeEnum.create;
    promiseType = ZodPromise.create;
    effectsType = ZodEffects.create;
    optionalType = ZodOptional.create;
    nullableType = ZodNullable.create;
    preprocessType = ZodEffects.createWithPreprocess;
    pipelineType = ZodPipeline.create;
    ostring = () => stringType().optional();
    onumber = () => numberType().optional();
    oboolean = () => booleanType().optional();
    coerce = {
      string: ((arg) => ZodString.create({ ...arg, coerce: true })),
      number: ((arg) => ZodNumber.create({ ...arg, coerce: true })),
      boolean: ((arg) => ZodBoolean.create({
        ...arg,
        coerce: true
      })),
      bigint: ((arg) => ZodBigInt.create({ ...arg, coerce: true })),
      date: ((arg) => ZodDate.create({ ...arg, coerce: true }))
    };
    NEVER = INVALID;
  }
});

// node_modules/zod/v3/external.js
var external_exports = {};
__export(external_exports, {
  BRAND: () => BRAND,
  DIRTY: () => DIRTY,
  EMPTY_PATH: () => EMPTY_PATH,
  INVALID: () => INVALID,
  NEVER: () => NEVER,
  OK: () => OK,
  ParseStatus: () => ParseStatus,
  Schema: () => ZodType,
  ZodAny: () => ZodAny,
  ZodArray: () => ZodArray,
  ZodBigInt: () => ZodBigInt,
  ZodBoolean: () => ZodBoolean,
  ZodBranded: () => ZodBranded,
  ZodCatch: () => ZodCatch,
  ZodDate: () => ZodDate,
  ZodDefault: () => ZodDefault,
  ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
  ZodEffects: () => ZodEffects,
  ZodEnum: () => ZodEnum,
  ZodError: () => ZodError,
  ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind,
  ZodFunction: () => ZodFunction,
  ZodIntersection: () => ZodIntersection,
  ZodIssueCode: () => ZodIssueCode,
  ZodLazy: () => ZodLazy,
  ZodLiteral: () => ZodLiteral,
  ZodMap: () => ZodMap,
  ZodNaN: () => ZodNaN,
  ZodNativeEnum: () => ZodNativeEnum,
  ZodNever: () => ZodNever,
  ZodNull: () => ZodNull,
  ZodNullable: () => ZodNullable,
  ZodNumber: () => ZodNumber,
  ZodObject: () => ZodObject,
  ZodOptional: () => ZodOptional,
  ZodParsedType: () => ZodParsedType,
  ZodPipeline: () => ZodPipeline,
  ZodPromise: () => ZodPromise,
  ZodReadonly: () => ZodReadonly,
  ZodRecord: () => ZodRecord,
  ZodSchema: () => ZodType,
  ZodSet: () => ZodSet,
  ZodString: () => ZodString,
  ZodSymbol: () => ZodSymbol,
  ZodTransformer: () => ZodEffects,
  ZodTuple: () => ZodTuple,
  ZodType: () => ZodType,
  ZodUndefined: () => ZodUndefined,
  ZodUnion: () => ZodUnion,
  ZodUnknown: () => ZodUnknown,
  ZodVoid: () => ZodVoid,
  addIssueToContext: () => addIssueToContext,
  any: () => anyType,
  array: () => arrayType,
  bigint: () => bigIntType,
  boolean: () => booleanType,
  coerce: () => coerce,
  custom: () => custom,
  date: () => dateType,
  datetimeRegex: () => datetimeRegex,
  defaultErrorMap: () => en_default,
  discriminatedUnion: () => discriminatedUnionType,
  effect: () => effectsType,
  enum: () => enumType,
  function: () => functionType,
  getErrorMap: () => getErrorMap,
  getParsedType: () => getParsedType,
  instanceof: () => instanceOfType,
  intersection: () => intersectionType,
  isAborted: () => isAborted,
  isAsync: () => isAsync,
  isDirty: () => isDirty,
  isValid: () => isValid,
  late: () => late,
  lazy: () => lazyType,
  literal: () => literalType,
  makeIssue: () => makeIssue,
  map: () => mapType,
  nan: () => nanType,
  nativeEnum: () => nativeEnumType,
  never: () => neverType,
  null: () => nullType,
  nullable: () => nullableType,
  number: () => numberType,
  object: () => objectType,
  objectUtil: () => objectUtil,
  oboolean: () => oboolean,
  onumber: () => onumber,
  optional: () => optionalType,
  ostring: () => ostring,
  pipeline: () => pipelineType,
  preprocess: () => preprocessType,
  promise: () => promiseType,
  quotelessJson: () => quotelessJson,
  record: () => recordType,
  set: () => setType,
  setErrorMap: () => setErrorMap,
  strictObject: () => strictObjectType,
  string: () => stringType,
  symbol: () => symbolType,
  transformer: () => effectsType,
  tuple: () => tupleType,
  undefined: () => undefinedType,
  union: () => unionType,
  unknown: () => unknownType,
  util: () => util,
  void: () => voidType
});
var init_external = __esm({
  "node_modules/zod/v3/external.js"() {
    init_errors2();
    init_parseUtil();
    init_typeAliases();
    init_util2();
    init_types();
    init_ZodError();
  }
});

// node_modules/zod/index.js
var init_zod = __esm({
  "node_modules/zod/index.js"() {
    init_external();
    init_external();
  }
});

// endpoints/ai/assistant_POST.schema.ts
var MessageRoleArrayValues, schema;
var init_assistant_POST_schema = __esm({
  "endpoints/ai/assistant_POST.schema.ts"() {
    "use strict";
    init_zod();
    MessageRoleArrayValues = ["user", "model"];
    schema = external_exports.object({
      message: external_exports.string().min(1, "Mensagem n\xE3o pode estar vazia"),
      imageBase64: external_exports.string().optional(),
      conversationHistory: external_exports.array(
        external_exports.object({
          role: external_exports.enum(MessageRoleArrayValues),
          text: external_exports.string()
        })
      ).optional()
    });
  }
});

// endpoints/ai/assistant_POST.ts
var assistant_POST_exports = {};
__export(assistant_POST_exports, {
  handle: () => handle5
});
async function handle5(request) {
  try {
    await getServerUserSession(request);
    const json = SuperJSON.parse(await request.text());
    const data = schema.parse(json);
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_GEMINI_API_KEY is not configured on the server.");
    }
    const contents = [];
    if (data.conversationHistory) {
      for (const msg of data.conversationHistory) {
        contents.push({
          role: msg.role,
          parts: [{ text: msg.text }]
        });
      }
    }
    const currentMessageParts = [{ text: data.message }];
    if (data.imageBase64) {
      const base64Data = data.imageBase64.replace(/^data:image\/\w+;base64,/, "");
      currentMessageParts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data
        }
      });
    }
    contents.push({
      role: "user",
      parts: currentMessageParts
    });
    const geminiPayload = {
      systemInstruction: {
        parts: [
          {
            text: "Voc\xEA \xE9 o Vision, um assistente visual inteligente para pessoas cegas. Descreva ambientes, objetos, detecte perigos e responda a perguntas sobre o que est\xE1 ao redor do usu\xE1rio. Seja conciso, claro e priorize alertas de seguran\xE7a. Responda sempre em portugu\xEAs do Brasil (pt-BR). Se uma imagem for fornecida, descreva o que voc\xEA v\xEA nela. Se nenhuma imagem for fornecida, responda com base na pergunta de texto."
          }
        ]
      },
      contents
    };
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(geminiPayload)
      }
    );
    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      throw new Error(`Gemini API error: ${geminiResponse.status} - ${errorText}`);
    }
    if (!geminiResponse.body) {
      throw new Error("No response body from Gemini API");
    }
    const stream = new ReadableStream({
      async start(controller) {
        const reader = geminiResponse.body.getReader();
        const decoder2 = new TextDecoder("utf-8");
        let fullText = "";
        let buffer = "";
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
            buffer += decoder2.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";
            for (const line of lines) {
              if (line.startsWith("data: ") && line.trim() !== "data:") {
                try {
                  const jsonData = JSON.parse(line.slice(6));
                  const text = jsonData.candidates?.[0]?.content?.parts?.[0]?.text || "";
                  fullText += text;
                } catch (e) {
                }
              }
            }
          }
          controller.close();
          if (fullText.trim().length > 0) {
            await db.insertInto("interactions").values({
              id: crypto.randomUUID(),
              mode: "smart",
              type: "question",
              userInput: data.message,
              systemResponse: fullText
            }).execute();
          }
        } catch (err) {
          controller.error(err);
          console.error("Stream processing error:", err);
        }
      }
    });
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive"
      }
    });
  } catch (error) {
    const message2 = error instanceof Error ? error.message : "Unknown error";
    return new Response(SuperJSON.stringify({ error: message2 }), { status: 400 });
  }
}
var init_assistant_POST = __esm({
  "endpoints/ai/assistant_POST.ts"() {
    "use strict";
    init_assistant_POST_schema();
    init_dist3();
    init_db();
    init_getServerUserSession();
  }
});

// endpoints/firmware/list_GET.ts
var list_GET_exports = {};
__export(list_GET_exports, {
  handle: () => handle6
});
async function handle6(request) {
  try {
    await getServerUserSession(request);
    const versions = await db.selectFrom("firmwareVersions").selectAll().orderBy("releaseDate", "desc").execute();
    const currentVersion = versions.find((v) => v.status === "installed") || null;
    return new Response(SuperJSON.stringify({
      versions,
      currentVersion
    }));
  } catch (error) {
    if (error instanceof NotAuthenticatedError) {
      return new Response(SuperJSON.stringify({ error: "Not authenticated" }), { status: 401 });
    }
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(SuperJSON.stringify({ error: errorMessage }), { status: 500 });
  }
}
var init_list_GET = __esm({
  "endpoints/firmware/list_GET.ts"() {
    "use strict";
    init_dist3();
    init_db();
    init_getServerUserSession();
    init_getSetServerSession();
  }
});

// endpoints/vision/analyze_POST.schema.ts
var schema2;
var init_analyze_POST_schema = __esm({
  "endpoints/vision/analyze_POST.schema.ts"() {
    "use strict";
    init_zod();
    init_dist3();
    schema2 = external_exports.object({
      imageBase64: external_exports.string().min(1, "Imagem \xE9 obrigat\xF3ria"),
      mode: external_exports.enum(["full", "smart"]),
      previousContext: external_exports.string().optional(),
      language: external_exports.string().default("pt-BR").optional()
    });
  }
});

// endpoints/vision/analyze_POST.ts
var analyze_POST_exports = {};
__export(analyze_POST_exports, {
  handle: () => handle7
});
async function handle7(request) {
  try {
    await getServerUserSession(request);
    const json = SuperJSON.parse(await request.text());
    const data = schema2.parse(json);
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_GEMINI_API_KEY is not configured no servidor.");
    }
    const base64Data = data.imageBase64.replace(/^data:image\/\w+;base64,/, "");
    let promptText = "Voc\xEA \xE9 um assistente visual para pessoas cegas. Descreva o que voc\xEA v\xEA na imagem de forma concisa (m\xE1ximo 2 frases). Foque em: obst\xE1culos, pessoas, objetos importantes, texto vis\xEDvel e perigos.";
    if (data.mode === "smart") {
      promptText += " Compare com o contexto anterior. Se N\xC3O houver mudan\xE7as significativas ou novos perigos, responda EXATAMENTE com 'SEM_MUDANCA'. S\xF3 descreva se algo novo, diferente ou perigoso aparecer.";
    } else {
      promptText += " Se o contexto anterior for fornecido, N\xC3O repita informa\xE7\xF5es j\xE1 descritas - foque apenas no que mudou ou \xE9 novo.";
    }
    promptText += ` Responda em ${data.language || "portugu\xEAs do Brasil"}.`;
    if (data.previousContext && data.previousContext.trim() !== "") {
      promptText += `

Contexto anterior: ${data.previousContext}`;
    }
    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            { text: promptText },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Data
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.4
      }
    };
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro na API do Gemini: ${response.status} - ${errorText}`);
    }
    const responseData = await response.json();
    const generatedText = responseData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    const isNoChange = data.mode === "smart" && (generatedText.includes("SEM_MUDANCA") || generatedText === "");
    const output = {
      description: isNoChange ? "" : generatedText,
      hasChange: !isNoChange
    };
    if (output.hasChange && output.description) {
      await db.insertInto("interactions").values({
        id: crypto.randomUUID(),
        mode: data.mode,
        type: "description",
        systemResponse: output.description,
        createdAt: /* @__PURE__ */ new Date()
      }).execute();
    }
    return new Response(SuperJSON.stringify(output));
  } catch (error) {
    const message2 = error instanceof Error ? error.message : "Erro desconhecido";
    return new Response(SuperJSON.stringify({ error: message2 }), { status: 400 });
  }
}
var init_analyze_POST = __esm({
  "endpoints/vision/analyze_POST.ts"() {
    "use strict";
    init_analyze_POST_schema();
    init_dist3();
    init_db();
    init_getServerUserSession();
  }
});

// helpers/schema.tsx
var VisionModeArrayValues, InteractionTypeArrayValues, SpeechRateArrayValues, VoiceTypeArrayValues;
var init_schema2 = __esm({
  "helpers/schema.tsx"() {
    "use strict";
    VisionModeArrayValues = ["full", "smart"];
    InteractionTypeArrayValues = ["alert", "command", "description", "question"];
    SpeechRateArrayValues = ["fast", "normal", "slow"];
    VoiceTypeArrayValues = ["feminine", "masculine"];
  }
});

// endpoints/settings/update_POST.schema.ts
var schema3;
var init_update_POST_schema = __esm({
  "endpoints/settings/update_POST.schema.ts"() {
    "use strict";
    init_zod();
    init_dist3();
    init_schema2();
    schema3 = external_exports.object({
      audioVolume: external_exports.number().min(0).max(100).optional(),
      speechRate: external_exports.enum(SpeechRateArrayValues).optional(),
      voiceType: external_exports.enum(VoiceTypeArrayValues).optional(),
      defaultVisionMode: external_exports.enum(VisionModeArrayValues).optional(),
      updateIntervalMs: external_exports.number().positive().optional(),
      headRotationThreshold: external_exports.number().positive().optional(),
      confidenceThreshold: external_exports.number().min(0).max(1).optional(),
      alertPriority: external_exports.boolean().optional(),
      vibrationFeedback: external_exports.boolean().optional()
    });
  }
});

// endpoints/settings/update_POST.ts
var update_POST_exports = {};
__export(update_POST_exports, {
  handle: () => handle8
});
async function handle8(request) {
  try {
    const { user } = await getServerUserSession(request);
    if (user.role !== "admin") {
      return new Response(SuperJSON.stringify({ error: "Forbidden" }), { status: 403 });
    }
    const json = SuperJSON.parse(await request.text());
    const result = schema3.parse(json);
    if (Object.keys(result).length === 0) {
      const current = await db.selectFrom("settings").selectAll().where("id", "=", "default").executeTakeFirst();
      if (!current) {
        throw new Error("Settings not found");
      }
      return new Response(SuperJSON.stringify(current));
    }
    const updatedSettings = await db.updateTable("settings").set({
      ...result,
      updatedAt: /* @__PURE__ */ new Date()
    }).where("id", "=", "default").returningAll().executeTakeFirst();
    if (!updatedSettings) {
      throw new Error("Settings not found to update");
    }
    return new Response(SuperJSON.stringify(updatedSettings));
  } catch (error) {
    if (error instanceof NotAuthenticatedError) {
      return new Response(SuperJSON.stringify({ error: "Not authenticated" }), { status: 401 });
    }
    const message2 = error instanceof Error ? error.message : "Unknown error";
    return new Response(SuperJSON.stringify({ error: message2 }), { status: 400 });
  }
}
var init_update_POST = __esm({
  "endpoints/settings/update_POST.ts"() {
    "use strict";
    init_update_POST_schema();
    init_dist3();
    init_db();
    init_getServerUserSession();
    init_getSetServerSession();
  }
});

// endpoints/firmware/install_POST.schema.ts
var schema4;
var init_install_POST_schema = __esm({
  "endpoints/firmware/install_POST.schema.ts"() {
    "use strict";
    init_zod();
    init_dist3();
    schema4 = external_exports.object({
      firmwareId: external_exports.string().min(1, "Firmware ID is required")
    });
  }
});

// endpoints/firmware/install_POST.ts
var install_POST_exports = {};
__export(install_POST_exports, {
  handle: () => handle9
});
async function handle9(request) {
  try {
    const { user } = await getServerUserSession(request);
    if (user.role !== "admin") {
      return new Response(SuperJSON.stringify({ error: "Forbidden: admin role required" }), { status: 403 });
    }
    const text = await request.text();
    const json = SuperJSON.parse(text);
    const result = schema4.parse(json);
    await db.updateTable("firmwareVersions").set({ status: "available", installedAt: null }).where("status", "=", "installed").execute();
    const updatedFirmware = await db.updateTable("firmwareVersions").set({
      status: "installed",
      installedAt: /* @__PURE__ */ new Date()
    }).where("id", "=", result.firmwareId).returningAll().executeTakeFirst();
    if (!updatedFirmware) {
      return new Response(SuperJSON.stringify({ error: "Firmware version not found" }), { status: 404 });
    }
    return new Response(SuperJSON.stringify(updatedFirmware));
  } catch (error) {
    if (error instanceof NotAuthenticatedError) {
      return new Response(SuperJSON.stringify({ error: "Not authenticated" }), { status: 401 });
    }
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(SuperJSON.stringify({ error: errorMessage }), { status: 400 });
  }
}
var init_install_POST = __esm({
  "endpoints/firmware/install_POST.ts"() {
    "use strict";
    init_install_POST_schema();
    init_dist3();
    init_db();
    init_getServerUserSession();
    init_getSetServerSession();
  }
});

// endpoints/interactions/list_GET.schema.ts
var schema5;
var init_list_GET_schema = __esm({
  "endpoints/interactions/list_GET.schema.ts"() {
    "use strict";
    init_zod();
    init_dist3();
    init_schema2();
    schema5 = external_exports.object({
      mode: external_exports.enum(VisionModeArrayValues).optional(),
      type: external_exports.enum(InteractionTypeArrayValues).optional(),
      limit: external_exports.coerce.number().min(1).max(100).default(50),
      offset: external_exports.coerce.number().min(0).default(0)
    });
  }
});

// endpoints/interactions/list_GET.ts
var list_GET_exports2 = {};
__export(list_GET_exports2, {
  handle: () => handle10
});
async function handle10(request) {
  try {
    await getServerUserSession(request);
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());
    const query = schema5.parse(queryParams);
    let dataQuery = db.selectFrom("interactions").selectAll();
    let countQuery = db.selectFrom("interactions").select(({ fn }) => fn.count("id").as("total"));
    if (query.mode) {
      dataQuery = dataQuery.where("mode", "=", query.mode);
      countQuery = countQuery.where("mode", "=", query.mode);
    }
    if (query.type) {
      dataQuery = dataQuery.where("type", "=", query.type);
      countQuery = countQuery.where("type", "=", query.type);
    }
    const [interactions, totalResult] = await Promise.all([
      dataQuery.orderBy("createdAt", "desc").limit(query.limit).offset(query.offset).execute(),
      countQuery.executeTakeFirst()
    ]);
    const total = totalResult ? Number(totalResult.total) : 0;
    return new Response(
      SuperJSON.stringify({ interactions, total }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    if (error instanceof NotAuthenticatedError) {
      return new Response(SuperJSON.stringify({ error: "Not authenticated" }), { status: 401 });
    }
    const message2 = error instanceof Error ? error.message : "Unknown error";
    return new Response(SuperJSON.stringify({ error: message2 }), { status: 400 });
  }
}
var init_list_GET2 = __esm({
  "endpoints/interactions/list_GET.ts"() {
    "use strict";
    init_list_GET_schema();
    init_dist3();
    init_db();
    init_getServerUserSession();
    init_getSetServerSession();
  }
});

// endpoints/interactions/stats_GET.ts
var stats_GET_exports = {};
__export(stats_GET_exports, {
  handle: () => handle11
});
async function handle11(request) {
  try {
    await getServerUserSession(request);
    const todayStart = /* @__PURE__ */ new Date();
    todayStart.setHours(0, 0, 0, 0);
    const [totalAndAvg, todayCount, modeCounts, typeCounts] = await Promise.all([
      db.selectFrom("interactions").select(({ fn }) => [
        fn.count("id").as("total"),
        fn.avg("confidence").as("avgConfidence")
      ]).executeTakeFirst(),
      db.selectFrom("interactions").select(({ fn }) => fn.count("id").as("today")).where("createdAt", ">=", todayStart).executeTakeFirst(),
      db.selectFrom("interactions").select(["mode", ({ fn }) => fn.count("id").as("count")]).groupBy("mode").execute(),
      db.selectFrom("interactions").select(["type", ({ fn }) => fn.count("id").as("count")]).groupBy("type").execute()
    ]);
    const stats = {
      totalInteractions: totalAndAvg ? Number(totalAndAvg.total) : 0,
      todayInteractions: todayCount ? Number(todayCount.today) : 0,
      avgConfidence: totalAndAvg?.avgConfidence ? Number(totalAndAvg.avgConfidence) : 0,
      byMode: {
        full: 0,
        smart: 0
      },
      byType: {
        description: 0,
        question: 0,
        alert: 0,
        command: 0
      }
    };
    modeCounts.forEach((row) => {
      if (row.mode === "full" || row.mode === "smart") {
        stats.byMode[row.mode] = Number(row.count);
      }
    });
    typeCounts.forEach((row) => {
      if (row.type === "description" || row.type === "question" || row.type === "alert" || row.type === "command") {
        stats.byType[row.type] = Number(row.count);
      }
    });
    return new Response(SuperJSON.stringify(stats), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    if (error instanceof NotAuthenticatedError) {
      return new Response(SuperJSON.stringify({ error: "Not authenticated" }), { status: 401 });
    }
    const message2 = error instanceof Error ? error.message : "Unknown error";
    return new Response(SuperJSON.stringify({ error: message2 }), { status: 400 });
  }
}
var init_stats_GET = __esm({
  "endpoints/interactions/stats_GET.ts"() {
    "use strict";
    init_dist3();
    init_db();
    init_getServerUserSession();
    init_getSetServerSession();
  }
});

// endpoints/interactions/create_POST.schema.ts
var schema6;
var init_create_POST_schema = __esm({
  "endpoints/interactions/create_POST.schema.ts"() {
    "use strict";
    init_zod();
    init_dist3();
    init_schema2();
    schema6 = external_exports.object({
      mode: external_exports.enum(VisionModeArrayValues),
      type: external_exports.enum(InteractionTypeArrayValues),
      userInput: external_exports.string().optional(),
      systemResponse: external_exports.string(),
      confidence: external_exports.number().min(0).max(1).optional()
    });
  }
});

// endpoints/interactions/create_POST.ts
var create_POST_exports = {};
__export(create_POST_exports, {
  handle: () => handle12
});
async function handle12(request) {
  try {
    await getServerUserSession(request);
    const json = SuperJSON.parse(await request.text());
    const data = schema6.parse(json);
    const interaction = await db.insertInto("interactions").values({
      id: crypto.randomUUID(),
      mode: data.mode,
      type: data.type,
      userInput: data.userInput ?? null,
      systemResponse: data.systemResponse,
      confidence: data.confidence ?? null
    }).returningAll().executeTakeFirstOrThrow();
    return new Response(SuperJSON.stringify(interaction), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    if (error instanceof NotAuthenticatedError) {
      return new Response(SuperJSON.stringify({ error: "Not authenticated" }), { status: 401 });
    }
    const message2 = error instanceof Error ? error.message : "Unknown error";
    return new Response(SuperJSON.stringify({ error: message2 }), { status: 400 });
  }
}
var init_create_POST = __esm({
  "endpoints/interactions/create_POST.ts"() {
    "use strict";
    init_create_POST_schema();
    init_dist3();
    init_db();
    init_getServerUserSession();
    init_getSetServerSession();
  }
});

// endpoints/auth/login_with_password_POST.schema.ts
var schema7;
var init_login_with_password_POST_schema = __esm({
  "endpoints/auth/login_with_password_POST.schema.ts"() {
    "use strict";
    init_zod();
    schema7 = external_exports.object({
      email: external_exports.string().email("Email is required"),
      password: external_exports.string().min(1, "Password is required")
    });
  }
});

// endpoints/auth/login_with_password_POST.ts
var login_with_password_POST_exports = {};
__export(login_with_password_POST_exports, {
  handle: () => handle13
});
import { compare } from "bcryptjs";
import { randomBytes } from "crypto";
function safeToDate(value) {
  if (value === null || value === void 0) {
    return null;
  }
  if (typeof value === "bigint") {
    return new Date(Number(value));
  }
  return new Date(value);
}
async function handle13(request) {
  try {
    const json = await request.json();
    const { email, password } = schema7.parse(json);
    const normalizedEmail = email.toLowerCase();
    const now = /* @__PURE__ */ new Date();
    const windowStart = new Date(
      now.getTime() - RATE_LIMIT_CONFIG.lockoutWindowMinutes * 60 * 1e3
    );
    const result = await db.transaction().execute(async (trx) => {
      await sql`SELECT pg_advisory_xact_lock(hashtextextended(${normalizedEmail},0))`.execute(
        trx
      );
      const rateLimitQuery = await trx.selectFrom("loginAttempts").select([
        trx.fn.countAll().as("failedCount"),
        trx.fn.max(trx.dynamic.ref("attemptedAt")).as("lastFailedAt")
      ]).where("email", "=", normalizedEmail).where("success", "=", false).where("attemptedAt", ">=", windowStart).where("attemptedAt", "is not", null).executeTakeFirst();
      const { failedCount = 0, lastFailedAt = null } = rateLimitQuery || {};
      const safeLastFailedAt = safeToDate(lastFailedAt);
      if (rateLimitQuery && failedCount >= RATE_LIMIT_CONFIG.maxFailedAttempts && safeLastFailedAt) {
        const lockoutEnd = new Date(
          safeLastFailedAt.getTime() + RATE_LIMIT_CONFIG.lockoutDurationMinutes * 60 * 1e3
        );
        if (now < lockoutEnd) {
          const remainingMinutes = Math.ceil(
            (lockoutEnd.getTime() - now.getTime()) / (60 * 1e3)
          );
          return {
            type: "rate_limited",
            remainingMinutes
          };
        }
      }
      const userResults = await trx.selectFrom("users").innerJoin("userPasswords", "users.id", "userPasswords.userId").select([
        "users.id",
        "users.email",
        "users.displayName",
        "users.avatarUrl",
        "users.role",
        "userPasswords.passwordHash"
      ]).where(sql`LOWER(users.email)`, "=", normalizedEmail).limit(1).execute();
      if (userResults.length === 0) {
        await trx.insertInto("loginAttempts").values({
          email: normalizedEmail,
          attemptedAt: now,
          success: false
        }).execute();
        return {
          type: "auth_failed"
        };
      }
      const user2 = userResults[0];
      const passwordValid = await compare(password, user2.passwordHash);
      if (!passwordValid) {
        await trx.insertInto("loginAttempts").values({
          email: normalizedEmail,
          attemptedAt: now,
          success: false
        }).execute();
        return {
          type: "auth_failed"
        };
      }
      await trx.insertInto("loginAttempts").values({
        email: normalizedEmail,
        attemptedAt: now,
        success: true
      }).execute();
      const sessionId = randomBytes(32).toString("hex");
      const expiresAt = new Date(
        now.getTime() + SessionExpirationSeconds * 1e3
      );
      await trx.insertInto("sessions").values({
        id: sessionId,
        userId: user2.id,
        createdAt: now,
        lastAccessed: now,
        expiresAt
      }).execute();
      await trx.deleteFrom("loginAttempts").where("email", "=", normalizedEmail).where("success", "=", false).execute();
      return {
        type: "success",
        user: user2,
        sessionId,
        sessionCreatedAt: now
      };
    });
    if (Math.random() < RATE_LIMIT_CONFIG.cleanupProbability) {
      const cleanupBefore = new Date(
        now.getTime() - RATE_LIMIT_CONFIG.lockoutWindowMinutes * 60 * 1e3
      );
      try {
        const deleteResult = await db.deleteFrom("loginAttempts").where("attemptedAt", "<", cleanupBefore).where("attemptedAt", "is not", null).executeTakeFirst();
      } catch {
      }
    }
    if (result.type === "rate_limited") {
      return Response.json(
        {
          message: `Too many failed login attempts. Account locked for ${result.remainingMinutes} more minutes.`
        },
        { status: 429 }
      );
    }
    if (result.type === "auth_failed") {
      return Response.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }
    const user = result.user;
    const userData = {
      id: user.id,
      email: user.email,
      avatarUrl: user.avatarUrl,
      displayName: user.displayName,
      role: user.role
    };
    const response = Response.json({
      user: userData
    });
    await setServerSession(response, {
      id: result.sessionId,
      createdAt: result.sessionCreatedAt.getTime(),
      lastAccessed: result.sessionCreatedAt.getTime()
    });
    return response;
  } catch (error) {
    return Response.json({ message: "Authentication failed" }, { status: 400 });
  }
}
var RATE_LIMIT_CONFIG;
var init_login_with_password_POST = __esm({
  "endpoints/auth/login_with_password_POST.ts"() {
    "use strict";
    init_db();
    init_esm();
    init_login_with_password_POST_schema();
    init_getSetServerSession();
    RATE_LIMIT_CONFIG = {
      maxFailedAttempts: 5,
      lockoutWindowMinutes: 15,
      lockoutDurationMinutes: 15,
      cleanupProbability: 0.1
    };
  }
});

// endpoints/auth/register_with_password_POST.schema.ts
var schema8;
var init_register_with_password_POST_schema = __esm({
  "endpoints/auth/register_with_password_POST.schema.ts"() {
    "use strict";
    init_zod();
    schema8 = external_exports.object({
      email: external_exports.string().email("Email is required"),
      password: external_exports.string().min(8, "Password must be at least 8 characters"),
      displayName: external_exports.string().min(1, "Name is required")
    });
  }
});

// helpers/generatePasswordHash.tsx
import { hash } from "bcryptjs";
async function generatePasswordHash(password) {
  const saltRounds = 10;
  const passwordHash = await hash(password, saltRounds);
  return passwordHash;
}
var init_generatePasswordHash = __esm({
  "helpers/generatePasswordHash.tsx"() {
    "use strict";
  }
});

// endpoints/auth/register_with_password_POST.ts
var register_with_password_POST_exports = {};
__export(register_with_password_POST_exports, {
  handle: () => handle14
});
import { randomBytes as randomBytes2 } from "crypto";
async function handle14(request) {
  try {
    const json = await request.json();
    const { email, password, displayName } = schema8.parse(json);
    const normalizedEmail = email.toLowerCase().trim();
    const passwordHash = await generatePasswordHash(password);
    const newUser = await db.transaction().execute(async (trx) => {
      let user;
      try {
        [user] = await trx.insertInto("users").values({
          email: normalizedEmail,
          displayName: displayName.trim(),
          role: "user"
        }).returning(["id", "email", "displayName", "createdAt"]).execute();
      } catch (err) {
        const pgErr = err;
        if (pgErr?.code === "23505") {
          throw new ConflictError("email already in use");
        }
        throw err;
      }
      await trx.insertInto("userPasswords").values({
        userId: user.id,
        passwordHash
      }).execute();
      return user;
    });
    const sessionId = randomBytes2(32).toString("hex");
    const now = /* @__PURE__ */ new Date();
    const expiresAt = new Date(now.getTime() + SessionExpirationSeconds * 1e3);
    await db.insertInto("sessions").values({
      id: sessionId,
      userId: newUser.id,
      createdAt: now,
      lastAccessed: now,
      expiresAt
    }).execute();
    const response = Response.json({
      user: {
        ...newUser,
        role: "user"
      }
    });
    await setServerSession(response, {
      id: sessionId,
      createdAt: now.getTime(),
      lastAccessed: now.getTime()
    });
    return response;
  } catch (error) {
    if (error instanceof ConflictError) {
      return Response.json({ message: error.message }, { status: 409 });
    }
    console.error("Registration error:", error);
    return Response.json({ message: "Registration failed" }, { status: 400 });
  }
}
var ConflictError;
var init_register_with_password_POST = __esm({
  "endpoints/auth/register_with_password_POST.ts"() {
    "use strict";
    init_db();
    init_register_with_password_POST_schema();
    init_getSetServerSession();
    init_generatePasswordHash();
    ConflictError = class extends Error {
      constructor(message2) {
        super(message2);
        this.name = "ConflictError";
      }
    };
  }
});

// node_modules/hono/dist/compose.js
var compose = (middleware, onError, onNotFound) => {
  return (context, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;
      let res;
      let isError2 = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        context.req.routeIndex = i;
      } else {
        handler = i === middleware.length && next || void 0;
      }
      if (handler) {
        try {
          res = await handler(context, () => dispatch(i + 1));
        } catch (err) {
          if (err instanceof Error && onError) {
            context.error = err;
            res = await onError(err, context);
            isError2 = true;
          } else {
            throw err;
          }
        }
      } else {
        if (context.finalized === false && onNotFound) {
          res = await onNotFound(context);
        }
      }
      if (res && (context.finalized === false || isError2)) {
        context.res = res;
      }
      return context;
    }
  };
};

// node_modules/hono/dist/request/constants.js
var GET_MATCH_RESULT = /* @__PURE__ */ Symbol();

// node_modules/hono/dist/utils/body.js
var parseBody = async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const headers = request instanceof HonoRequest ? request.raw.headers : request.headers;
  const contentType = headers.get("Content-Type");
  if (contentType?.startsWith("multipart/form-data") || contentType?.startsWith("application/x-www-form-urlencoded")) {
    return parseFormData(request, { all, dot });
  }
  return {};
};
async function parseFormData(request, options) {
  const formData = await request.formData();
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form, key, value);
        delete form[key];
      }
    });
  }
  return form;
}
var handleParsingAllValues = (form, key, value) => {
  if (form[key] !== void 0) {
    if (Array.isArray(form[key])) {
      ;
      form[key].push(value);
    } else {
      form[key] = [form[key], value];
    }
  } else {
    if (!key.endsWith("[]")) {
      form[key] = value;
    } else {
      form[key] = [value];
    }
  }
};
var handleParsingNestedValues = (form, key, value) => {
  if (/(?:^|\.)__proto__\./.test(key)) {
    return;
  }
  let nestedForm = form;
  const keys = key.split(".");
  keys.forEach((key2, index) => {
    if (index === keys.length - 1) {
      nestedForm[key2] = value;
    } else {
      if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
};

// node_modules/hono/dist/utils/url.js
var splitPath = (path) => {
  const paths = path.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
};
var splitRoutingPath = (routePath) => {
  const { groups, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
};
var extractGroupsFromPath = (path) => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match2, index) => {
    const mark = `@${index}`;
    groups.push([mark, match2]);
    return mark;
  });
  return { groups, path };
};
var replaceGroupMarks = (paths, groups) => {
  for (let i = groups.length - 1; i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1; j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
};
var patternCache = {};
var getPattern = (label, next) => {
  if (label === "*") {
    return "*";
  }
  const match2 = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match2) {
    const cacheKey = `${label}#${next}`;
    if (!patternCache[cacheKey]) {
      if (match2[2]) {
        patternCache[cacheKey] = next && next[0] !== ":" && next[0] !== "*" ? [cacheKey, match2[1], new RegExp(`^${match2[2]}(?=/${next})`)] : [label, match2[1], new RegExp(`^${match2[2]}$`)];
      } else {
        patternCache[cacheKey] = [label, match2[1], true];
      }
    }
    return patternCache[cacheKey];
  }
  return null;
};
var tryDecode = (str, decoder2) => {
  try {
    return decoder2(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match2) => {
      try {
        return decoder2(match2);
      } catch {
        return match2;
      }
    });
  }
};
var tryDecodeURI = (str) => tryDecode(str, decodeURI);
var getPath = (request) => {
  const url = request.url;
  const start = url.indexOf("/", url.indexOf(":") + 4);
  let i = start;
  for (; i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const hashIndex = url.indexOf("#", i);
      const end = queryIndex === -1 ? hashIndex === -1 ? void 0 : hashIndex : hashIndex === -1 ? queryIndex : Math.min(queryIndex, hashIndex);
      const path = url.slice(start, end);
      return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
    } else if (charCode === 63 || charCode === 35) {
      break;
    }
  }
  return url.slice(start, i);
};
var getPathNoStrict = (request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
};
var mergePath = (base, sub, ...rest) => {
  if (rest.length) {
    sub = mergePath(sub, ...rest);
  }
  return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
};
var checkOptionalParameter = (path) => {
  if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(":")) {
    return null;
  }
  const segments = path.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (/\?/.test(segment)) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.replace("?", "");
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
};
var _decodeURI = (value) => {
  if (!/[%+]/.test(value)) {
    return value;
  }
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return value.indexOf("%") !== -1 ? tryDecode(value, decodeURIComponent_) : value;
};
var _getQueryParam = (url, key, multiple) => {
  let encoded;
  if (!multiple && key && !/[%+]/.test(key)) {
    let keyIndex2 = url.indexOf("?", 8);
    if (keyIndex2 === -1) {
      return void 0;
    }
    if (!url.startsWith(key, keyIndex2 + 1)) {
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return void 0;
    }
  }
  const results = {};
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(
      keyIndex + 1,
      valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex
    );
    if (encoded) {
      name = _decodeURI(name);
    }
    keyIndex = nextKeyIndex;
    if (name === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      ;
      results[name].push(value);
    } else {
      results[name] ??= value;
    }
  }
  return key ? results[key] : results;
};
var getQueryParam = _getQueryParam;
var getQueryParams = (url, key) => {
  return _getQueryParam(url, key, true);
};
var decodeURIComponent_ = decodeURIComponent;

// node_modules/hono/dist/request.js
var tryDecodeURIComponent = (str) => tryDecode(str, decodeURIComponent_);
var HonoRequest = class {
  /**
   * `.raw` can get the raw Request object.
   *
   * @see {@link https://hono.dev/docs/api/request#raw}
   *
   * @example
   * ```ts
   * // For Cloudflare Workers
   * app.post('/', async (c) => {
   *   const metadata = c.req.raw.cf?.hostMetadata?
   *   ...
   * })
   * ```
   */
  raw;
  #validatedData;
  // Short name of validatedData
  #matchResult;
  routeIndex = 0;
  /**
   * `.path` can get the pathname of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#path}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const pathname = c.req.path // `/about/me`
   * })
   * ```
   */
  path;
  bodyCache = {};
  constructor(request, path = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path;
    this.#matchResult = matchResult;
    this.#validatedData = {};
  }
  param(key) {
    return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
  }
  #getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex][1][key];
    const param = this.#getParamValue(paramKey);
    return param && /\%/.test(param) ? tryDecodeURIComponent(param) : param;
  }
  #getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
    for (const key of keys) {
      const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value !== void 0) {
        decoded[key] = /\%/.test(value) ? tryDecodeURIComponent(value) : value;
      }
    }
    return decoded;
  }
  #getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) {
      return this.raw.headers.get(name) ?? void 0;
    }
    const headerData = {};
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    return parseBody(this, options);
  }
  #cachedBody = (key) => {
    const { bodyCache, raw: raw2 } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) {
      return cachedBody;
    }
    const anyCachedKey = Object.keys(bodyCache)[0];
    if (anyCachedKey) {
      return bodyCache[anyCachedKey].then((body) => {
        if (anyCachedKey === "json") {
          body = JSON.stringify(body);
        }
        return new Response(body)[key]();
      });
    }
    return bodyCache[key] = raw2[key]();
  };
  /**
   * `.json()` can parse Request body of type `application/json`
   *
   * @see {@link https://hono.dev/docs/api/request#json}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.json()
   * })
   * ```
   */
  json() {
    return this.#cachedBody("text").then((text) => JSON.parse(text));
  }
  /**
   * `.text()` can parse Request body of type `text/plain`
   *
   * @see {@link https://hono.dev/docs/api/request#text}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.text()
   * })
   * ```
   */
  text() {
    return this.#cachedBody("text");
  }
  /**
   * `.arrayBuffer()` parse Request body as an `ArrayBuffer`
   *
   * @see {@link https://hono.dev/docs/api/request#arraybuffer}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.arrayBuffer()
   * })
   * ```
   */
  arrayBuffer() {
    return this.#cachedBody("arrayBuffer");
  }
  /**
   * Parses the request body as a `Blob`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.blob();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#blob
   */
  blob() {
    return this.#cachedBody("blob");
  }
  /**
   * Parses the request body as `FormData`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.formData();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#formdata
   */
  formData() {
    return this.#cachedBody("formData");
  }
  /**
   * Adds validated data to the request.
   *
   * @param target - The target of the validation.
   * @param data - The validated data to add.
   */
  addValidatedData(target, data) {
    this.#validatedData[target] = data;
  }
  valid(target) {
    return this.#validatedData[target];
  }
  /**
   * `.url()` can get the request url strings.
   *
   * @see {@link https://hono.dev/docs/api/request#url}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const url = c.req.url // `http://localhost:8787/about/me`
   *   ...
   * })
   * ```
   */
  get url() {
    return this.raw.url;
  }
  /**
   * `.method()` can get the method name of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#method}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const method = c.req.method // `GET`
   * })
   * ```
   */
  get method() {
    return this.raw.method;
  }
  get [GET_MATCH_RESULT]() {
    return this.#matchResult;
  }
  /**
   * `.matchedRoutes()` can return a matched route in the handler
   *
   * @deprecated
   *
   * Use matchedRoutes helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#matchedroutes}
   *
   * @example
   * ```ts
   * app.use('*', async function logger(c, next) {
   *   await next()
   *   c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
   *     const name = handler.name || (handler.length < 2 ? '[handler]' : '[middleware]')
   *     console.log(
   *       method,
   *       ' ',
   *       path,
   *       ' '.repeat(Math.max(10 - path.length, 0)),
   *       name,
   *       i === c.req.routeIndex ? '<- respond from here' : ''
   *     )
   *   })
   * })
   * ```
   */
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  /**
   * `routePath()` can retrieve the path registered within the handler
   *
   * @deprecated
   *
   * Use routePath helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#routepath}
   *
   * @example
   * ```ts
   * app.get('/posts/:id', (c) => {
   *   return c.json({ path: c.req.routePath })
   * })
   * ```
   */
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
};

// node_modules/hono/dist/utils/html.js
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw = (value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
};
var resolveCallback = async (str, phase, preserveCallbacks, context, buffer) => {
  if (typeof str === "object" && !(str instanceof String)) {
    if (!(str instanceof Promise)) {
      str = str.toString();
    }
    if (str instanceof Promise) {
      str = await str;
    }
  }
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context }))).then(
    (res) => Promise.all(
      res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context, buffer))
    ).then(() => buffer[0])
  );
  if (preserveCallbacks) {
    return raw(await resStr, callbacks);
  } else {
    return resStr;
  }
};

// node_modules/hono/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setDefaultContentType = (contentType, headers) => {
  return {
    "Content-Type": contentType,
    ...headers
  };
};
var createResponseInstance = (body, init) => new Response(body, init);
var Context = class {
  #rawRequest;
  #req;
  /**
   * `.env` can get bindings (environment variables, secrets, KV namespaces, D1 database, R2 bucket etc.) in Cloudflare Workers.
   *
   * @see {@link https://hono.dev/docs/api/context#env}
   *
   * @example
   * ```ts
   * // Environment object for Cloudflare Workers
   * app.get('*', async c => {
   *   const counter = c.env.COUNTER
   * })
   * ```
   */
  env = {};
  #var;
  finalized = false;
  /**
   * `.error` can get the error object from the middleware if the Handler throws an error.
   *
   * @see {@link https://hono.dev/docs/api/context#error}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   await next()
   *   if (c.error) {
   *     // do something...
   *   }
   * })
   * ```
   */
  error;
  #status;
  #executionCtx;
  #res;
  #layout;
  #renderer;
  #notFoundHandler;
  #preparedHeaders;
  #matchResult;
  #path;
  /**
   * Creates an instance of the Context class.
   *
   * @param req - The Request object.
   * @param options - Optional configuration options for the context.
   */
  constructor(req, options) {
    this.#rawRequest = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      this.#notFoundHandler = options.notFoundHandler;
      this.#path = options.path;
      this.#matchResult = options.matchResult;
    }
  }
  /**
   * `.req` is the instance of {@link HonoRequest}.
   */
  get req() {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#event}
   * The FetchEvent associated with the current request.
   *
   * @throws Will throw an error if the context does not have a FetchEvent.
   */
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#executionctx}
   * The ExecutionContext associated with the current request.
   *
   * @throws Will throw an error if the context does not have an ExecutionContext.
   */
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#res}
   * The Response object for the current request.
   */
  get res() {
    return this.#res ||= createResponseInstance(null, {
      headers: this.#preparedHeaders ??= new Headers()
    });
  }
  /**
   * Sets the Response object for the current request.
   *
   * @param _res - The Response object to set.
   */
  set res(_res) {
    if (this.#res && _res) {
      _res = createResponseInstance(_res.body, _res);
      for (const [k, v] of this.#res.headers.entries()) {
        if (k === "content-type") {
          continue;
        }
        if (k === "set-cookie") {
          const cookies = this.#res.headers.getSetCookie();
          _res.headers.delete("set-cookie");
          for (const cookie of cookies) {
            _res.headers.append("set-cookie", cookie);
          }
        } else {
          _res.headers.set(k, v);
        }
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  /**
   * `.render()` can create a response within a layout.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   return c.render('Hello!')
   * })
   * ```
   */
  render = (...args) => {
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  };
  /**
   * Sets the layout for the response.
   *
   * @param layout - The layout to set.
   * @returns The layout function.
   */
  setLayout = (layout) => this.#layout = layout;
  /**
   * Gets the current layout for the response.
   *
   * @returns The current layout function.
   */
  getLayout = () => this.#layout;
  /**
   * `.setRenderer()` can set the layout in the custom middleware.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```tsx
   * app.use('*', async (c, next) => {
   *   c.setRenderer((content) => {
   *     return c.html(
   *       <html>
   *         <body>
   *           <p>{content}</p>
   *         </body>
   *       </html>
   *     )
   *   })
   *   await next()
   * })
   * ```
   */
  setRenderer = (renderer) => {
    this.#renderer = renderer;
  };
  /**
   * `.header()` can set headers.
   *
   * @see {@link https://hono.dev/docs/api/context#header}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  header = (name, value, options) => {
    if (this.finalized) {
      this.#res = createResponseInstance(this.#res.body, this.#res);
    }
    const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
    if (value === void 0) {
      headers.delete(name);
    } else if (options?.append) {
      headers.append(name, value);
    } else {
      headers.set(name, value);
    }
  };
  status = (status) => {
    this.#status = status;
  };
  /**
   * `.set()` can set the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   c.set('message', 'Hono is hot!!')
   *   await next()
   * })
   * ```
   */
  set = (key, value) => {
    this.#var ??= /* @__PURE__ */ new Map();
    this.#var.set(key, value);
  };
  /**
   * `.get()` can use the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   const message = c.get('message')
   *   return c.text(`The message is "${message}"`)
   * })
   * ```
   */
  get = (key) => {
    return this.#var ? this.#var.get(key) : void 0;
  };
  /**
   * `.var` can access the value of a variable.
   *
   * @see {@link https://hono.dev/docs/api/context#var}
   *
   * @example
   * ```ts
   * const result = c.var.client.oneMethod()
   * ```
   */
  // c.var.propName is a read-only
  get var() {
    if (!this.#var) {
      return {};
    }
    return Object.fromEntries(this.#var);
  }
  #newResponse(data, arg, headers) {
    const responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders ?? new Headers();
    if (typeof arg === "object" && "headers" in arg) {
      const argHeaders = arg.headers instanceof Headers ? arg.headers : new Headers(arg.headers);
      for (const [key, value] of argHeaders) {
        if (key.toLowerCase() === "set-cookie") {
          responseHeaders.append(key, value);
        } else {
          responseHeaders.set(key, value);
        }
      }
    }
    if (headers) {
      for (const [k, v] of Object.entries(headers)) {
        if (typeof v === "string") {
          responseHeaders.set(k, v);
        } else {
          responseHeaders.delete(k);
          for (const v2 of v) {
            responseHeaders.append(k, v2);
          }
        }
      }
    }
    const status = typeof arg === "number" ? arg : arg?.status ?? this.#status;
    return createResponseInstance(data, { status, headers: responseHeaders });
  }
  newResponse = (...args) => this.#newResponse(...args);
  /**
   * `.body()` can return the HTTP response.
   * You can set headers with `.header()` and set HTTP status code with `.status`.
   * This can also be set in `.text()`, `.json()` and so on.
   *
   * @see {@link https://hono.dev/docs/api/context#body}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *   // Set HTTP status code
   *   c.status(201)
   *
   *   // Return the response body
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  body = (data, arg, headers) => this.#newResponse(data, arg, headers);
  /**
   * `.text()` can render text as `Content-Type:text/plain`.
   *
   * @see {@link https://hono.dev/docs/api/context#text}
   *
   * @example
   * ```ts
   * app.get('/say', (c) => {
   *   return c.text('Hello!')
   * })
   * ```
   */
  text = (text, arg, headers) => {
    return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text) : this.#newResponse(
      text,
      arg,
      setDefaultContentType(TEXT_PLAIN, headers)
    );
  };
  /**
   * `.json()` can render JSON as `Content-Type:application/json`.
   *
   * @see {@link https://hono.dev/docs/api/context#json}
   *
   * @example
   * ```ts
   * app.get('/api', (c) => {
   *   return c.json({ message: 'Hello!' })
   * })
   * ```
   */
  json = (object, arg, headers) => {
    return this.#newResponse(
      JSON.stringify(object),
      arg,
      setDefaultContentType("application/json", headers)
    );
  };
  html = (html, arg, headers) => {
    const res = (html2) => this.#newResponse(html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers));
    return typeof html === "object" ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
  };
  /**
   * `.redirect()` can Redirect, default status code is 302.
   *
   * @see {@link https://hono.dev/docs/api/context#redirect}
   *
   * @example
   * ```ts
   * app.get('/redirect', (c) => {
   *   return c.redirect('/')
   * })
   * app.get('/redirect-permanently', (c) => {
   *   return c.redirect('/', 301)
   * })
   * ```
   */
  redirect = (location, status) => {
    const locationString = String(location);
    this.header(
      "Location",
      // Multibyes should be encoded
      // eslint-disable-next-line no-control-regex
      !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString)
    );
    return this.newResponse(null, status ?? 302);
  };
  /**
   * `.notFound()` can return the Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/context#notfound}
   *
   * @example
   * ```ts
   * app.get('/notfound', (c) => {
   *   return c.notFound()
   * })
   * ```
   */
  notFound = () => {
    this.#notFoundHandler ??= () => createResponseInstance();
    return this.#notFoundHandler(this);
  };
};

// node_modules/hono/dist/router.js
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
};

// node_modules/hono/dist/utils/constants.js
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";

// node_modules/hono/dist/hono-base.js
var notFoundHandler = (c) => {
  return c.text("404 Not Found", 404);
};
var errorHandler = (err, c) => {
  if ("getResponse" in err) {
    const res = err.getResponse();
    return c.newResponse(res.body, res);
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
};
var Hono = class _Hono {
  get;
  post;
  put;
  delete;
  options;
  patch;
  all;
  on;
  use;
  /*
    This class is like an abstract class and does not have a router.
    To use it, inherit the class and implement router in the constructor.
  */
  router;
  getPath;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          this.#path = args1;
        } else {
          this.#addRoute(method, this.#path, args1);
        }
        args.forEach((handler) => {
          this.#addRoute(method, this.#path, handler);
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      for (const p of [path].flat()) {
        this.#path = p;
        for (const m of [method].flat()) {
          handlers.map((handler) => {
            this.#addRoute(m.toUpperCase(), this.#path, handler);
          });
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        this.#path = arg1;
      } else {
        this.#path = "*";
        handlers.unshift(arg1);
      }
      handlers.forEach((handler) => {
        this.#addRoute(METHOD_NAME_ALL, this.#path, handler);
      });
      return this;
    };
    const { strict, ...optionsWithoutStrict } = options;
    Object.assign(this, optionsWithoutStrict);
    this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
  }
  #clone() {
    const clone = new _Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.errorHandler = this.errorHandler;
    clone.#notFoundHandler = this.#notFoundHandler;
    clone.routes = this.routes;
    return clone;
  }
  #notFoundHandler = notFoundHandler;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  errorHandler = errorHandler;
  /**
   * `.route()` allows grouping other Hono instance in routes.
   *
   * @see {@link https://hono.dev/docs/api/routing#grouping}
   *
   * @param {string} path - base Path
   * @param {Hono} app - other Hono instance
   * @returns {Hono} routed Hono instance
   *
   * @example
   * ```ts
   * const app = new Hono()
   * const app2 = new Hono()
   *
   * app2.get("/user", (c) => c.text("user"))
   * app.route("/api", app2) // GET /api/user
   * ```
   */
  route(path, app2) {
    const subApp = this.basePath(path);
    app2.routes.map((r) => {
      let handler;
      if (app2.errorHandler === errorHandler) {
        handler = r.handler;
      } else {
        handler = async (c, next) => (await compose([], app2.errorHandler)(c, () => r.handler(c, next))).res;
        handler[COMPOSED_HANDLER] = r.handler;
      }
      subApp.#addRoute(r.method, r.path, handler);
    });
    return this;
  }
  /**
   * `.basePath()` allows base paths to be specified.
   *
   * @see {@link https://hono.dev/docs/api/routing#base-path}
   *
   * @param {string} path - base Path
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * const api = new Hono().basePath('/api')
   * ```
   */
  basePath(path) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  /**
   * `.onError()` handles an error and returns a customized Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#error-handling}
   *
   * @param {ErrorHandler} handler - request Handler for error
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.onError((err, c) => {
   *   console.error(`${err}`)
   *   return c.text('Custom Error Message', 500)
   * })
   * ```
   */
  onError = (handler) => {
    this.errorHandler = handler;
    return this;
  };
  /**
   * `.notFound()` allows you to customize a Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#not-found}
   *
   * @param {NotFoundHandler} handler - request handler for not-found
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.notFound((c) => {
   *   return c.text('Custom 404 Message', 404)
   * })
   * ```
   */
  notFound = (handler) => {
    this.#notFoundHandler = handler;
    return this;
  };
  /**
   * `.mount()` allows you to mount applications built with other frameworks into your Hono application.
   *
   * @see {@link https://hono.dev/docs/api/hono#mount}
   *
   * @param {string} path - base Path
   * @param {Function} applicationHandler - other Request Handler
   * @param {MountOptions} [options] - options of `.mount()`
   * @returns {Hono} mounted Hono instance
   *
   * @example
   * ```ts
   * import { Router as IttyRouter } from 'itty-router'
   * import { Hono } from 'hono'
   * // Create itty-router application
   * const ittyRouter = IttyRouter()
   * // GET /itty-router/hello
   * ittyRouter.get('/hello', () => new Response('Hello from itty-router'))
   *
   * const app = new Hono()
   * app.mount('/itty-router', ittyRouter.handle)
   * ```
   *
   * @example
   * ```ts
   * const app = new Hono()
   * // Send the request to another application without modification.
   * app.mount('/app', anotherApp, {
   *   replaceRequest: (req) => req,
   * })
   * ```
   */
  mount(path, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") {
        optionHandler = options;
      } else {
        optionHandler = options.optionHandler;
        if (options.replaceRequest === false) {
          replaceRequest = (request) => request;
        } else {
          replaceRequest = options.replaceRequest;
        }
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [options2];
    } : (c) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      return [c.env, executionContext];
    };
    replaceRequest ||= (() => {
      const mergedPath = mergePath(this._basePath, path);
      const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
      return (request) => {
        const url = new URL(request.url);
        url.pathname = url.pathname.slice(pathPrefixLength) || "/";
        return new Request(url, request);
      };
    })();
    const handler = async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) {
        return res;
      }
      await next();
    };
    this.#addRoute(METHOD_NAME_ALL, mergePath(path, "*"), handler);
    return this;
  }
  #addRoute(method, path, handler) {
    method = method.toUpperCase();
    path = mergePath(this._basePath, path);
    const r = { basePath: this._basePath, path, method, handler };
    this.router.add(method, path, [handler, r]);
    this.routes.push(r);
  }
  #handleError(err, c) {
    if (err instanceof Error) {
      return this.errorHandler(err, c);
    }
    throw err;
  }
  #dispatch(request, executionCtx, env, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.#dispatch(request, executionCtx, env, "GET")))();
    }
    const path = this.getPath(request, { env });
    const matchResult = this.router.match(method, path);
    const c = new Context(request, {
      path,
      matchResult,
      env,
      executionCtx,
      notFoundHandler: this.#notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.#notFoundHandler(c);
        });
      } catch (err) {
        return this.#handleError(err, c);
      }
      return res instanceof Promise ? res.then(
        (resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))
      ).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
    }
    const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const context = await composed(c);
        if (!context.finalized) {
          throw new Error(
            "Context is not finalized. Did you forget to return a Response object or `await next()`?"
          );
        }
        return context.res;
      } catch (err) {
        return this.#handleError(err, c);
      }
    })();
  }
  /**
   * `.fetch()` will be entry point of your app.
   *
   * @see {@link https://hono.dev/docs/api/hono#fetch}
   *
   * @param {Request} request - request Object of request
   * @param {Env} Env - env Object
   * @param {ExecutionContext} - context of execution
   * @returns {Response | Promise<Response>} response of request
   *
   */
  fetch = (request, ...rest) => {
    return this.#dispatch(request, rest[1], rest[0], request.method);
  };
  /**
   * `.request()` is a useful method for testing.
   * You can pass a URL or pathname to send a GET request.
   * app will return a Response object.
   * ```ts
   * test('GET /hello is ok', async () => {
   *   const res = await app.request('/hello')
   *   expect(res.status).toBe(200)
   * })
   * ```
   * @see https://hono.dev/docs/api/hono#request
   */
  request = (input, requestInit, Env, executionCtx) => {
    if (input instanceof Request) {
      return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
    }
    input = input.toString();
    return this.fetch(
      new Request(
        /^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`,
        requestInit
      ),
      Env,
      executionCtx
    );
  };
  /**
   * `.fire()` automatically adds a global fetch event listener.
   * This can be useful for environments that adhere to the Service Worker API, such as non-ES module Cloudflare Workers.
   * @deprecated
   * Use `fire` from `hono/service-worker` instead.
   * ```ts
   * import { Hono } from 'hono'
   * import { fire } from 'hono/service-worker'
   *
   * const app = new Hono()
   * // ...
   * fire(app)
   * ```
   * @see https://hono.dev/docs/api/hono#fire
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
   * @see https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/
   */
  fire = () => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
    });
  };
};

// node_modules/hono/dist/router/reg-exp-router/matcher.js
var emptyParam = [];
function match(method, path) {
  const matchers = this.buildAllMatchers();
  const match2 = ((method2, path2) => {
    const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
    const staticMatch = matcher[2][path2];
    if (staticMatch) {
      return staticMatch;
    }
    const match3 = path2.match(matcher[0]);
    if (!match3) {
      return [[], emptyParam];
    }
    const index = match3.indexOf("", 1);
    return [matcher[1][index], match3];
  });
  this.match = match2;
  return match2(method, path);
}

// node_modules/hono/dist/router/reg-exp-router/node.js
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = /* @__PURE__ */ Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
function compareKey(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? a < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
var Node = class _Node {
  #index;
  #varIndex;
  #children = /* @__PURE__ */ Object.create(null);
  insert(tokens, index, paramMap, context, pathErrorCheckOnly) {
    if (tokens.length === 0) {
      if (this.#index !== void 0) {
        throw PATH_ERROR;
      }
      if (pathErrorCheckOnly) {
        return;
      }
      this.#index = index;
      return;
    }
    const [token, ...restTokens] = tokens;
    const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let node;
    if (pattern) {
      const name = pattern[1];
      let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
      if (name && pattern[2]) {
        if (regexpStr === ".*") {
          throw PATH_ERROR;
        }
        regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
        if (/\((?!\?:)/.test(regexpStr)) {
          throw PATH_ERROR;
        }
      }
      node = this.#children[regexpStr];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[regexpStr] = new _Node();
        if (name !== "") {
          node.#varIndex = context.varIndex++;
        }
      }
      if (!pathErrorCheckOnly && name !== "") {
        paramMap.push([name, node.#varIndex]);
      }
    } else {
      node = this.#children[token];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[token] = new _Node();
      }
    }
    node.insert(restTokens, index, paramMap, context, pathErrorCheckOnly);
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.#children).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = this.#children[k];
      return (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + c.buildRegExpStr();
    });
    if (typeof this.#index === "number") {
      strList.unshift(`#${this.#index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
};

// node_modules/hono/dist/router/reg-exp-router/trie.js
var Trie = class {
  #context = { varIndex: 0 };
  #root = new Node();
  insert(path, index, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups = [];
    for (let i = 0; ; ) {
      let replaced = false;
      path = path.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = path.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1; i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1; j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    this.#root.insert(tokens, index, paramAssoc, this.#context, pathErrorCheckOnly);
    return paramAssoc;
  }
  buildRegExp() {
    let regexp = this.#root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (handlerIndex !== void 0) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== void 0) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
};

// node_modules/hono/dist/router/reg-exp-router/router.js
var nullMatcher = [/^$/, [], /* @__PURE__ */ Object.create(null)];
var wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ??= new RegExp(
    path === "*" ? "" : `^${path.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (_, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)"
    )}$`
  );
}
function clearWildcardRegExpCache() {
  wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
}
function buildMatcherFromPreprocessedRoutes(routes) {
  const trie = new Trie();
  const handlerData = [];
  if (routes.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes.map(
    (route) => [!/\*|\/:/.test(route[0]), ...route]
  ).sort(
    ([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length
  );
  const staticMap = /* @__PURE__ */ Object.create(null);
  for (let i = 0, j = -1, len = routesWithStaticPathFlag.length; i < len; i++) {
    const [pathErrorCheckOnly, path, handlers] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path] = [handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), emptyParam];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j] = handlers.map(([h, paramCount]) => {
      const paramIndexMap = /* @__PURE__ */ Object.create(null);
      paramCount -= 1;
      for (; paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [h, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
  for (let i = 0, len = handlerData.length; i < len; i++) {
    for (let j = 0, len2 = handlerData[i].length; j < len2; j++) {
      const map = handlerData[i][j]?.[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k = 0, len3 = keys.length; k < len3; k++) {
        map[keys[k]] = paramReplacementMap[map[keys[k]]];
      }
    }
  }
  const handlerMap = [];
  for (const i in indexReplacementMap) {
    handlerMap[i] = handlerData[indexReplacementMap[i]];
  }
  return [regexp, handlerMap, staticMap];
}
function findMiddleware(middleware, path) {
  if (!middleware) {
    return void 0;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [...middleware[k]];
    }
  }
  return void 0;
}
var RegExpRouter = class {
  name = "RegExpRouter";
  #middleware;
  #routes;
  constructor() {
    this.#middleware = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
    this.#routes = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
  }
  add(method, path, handler) {
    const middleware = this.#middleware;
    const routes = this.#routes;
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      ;
      [middleware, routes].forEach((handlerMap) => {
        handlerMap[method] = /* @__PURE__ */ Object.create(null);
        Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p) => {
          handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
        });
      });
    }
    if (path === "/*") {
      path = "*";
    }
    const paramCount = (path.match(/\/:/g) || []).length;
    if (/\*$/.test(path)) {
      const re = buildWildcardRegExp(path);
      if (method === METHOD_NAME_ALL) {
        Object.keys(middleware).forEach((m) => {
          middleware[m][path] ||= findMiddleware(middleware[m], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
        });
      } else {
        middleware[method][path] ||= findMiddleware(middleware[method], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
      }
      Object.keys(middleware).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(middleware[m]).forEach((p) => {
            re.test(p) && middleware[m][p].push([handler, paramCount]);
          });
        }
      });
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(routes[m]).forEach(
            (p) => re.test(p) && routes[m][p].push([handler, paramCount])
          );
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path) || [path];
    for (let i = 0, len = paths.length; i < len; i++) {
      const path2 = paths[i];
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          routes[m][path2] ||= [
            ...findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []
          ];
          routes[m][path2].push([handler, paramCount - len + i + 1]);
        }
      });
    }
  }
  match = match;
  buildAllMatchers() {
    const matchers = /* @__PURE__ */ Object.create(null);
    Object.keys(this.#routes).concat(Object.keys(this.#middleware)).forEach((method) => {
      matchers[method] ||= this.#buildMatcher(method);
    });
    this.#middleware = this.#routes = void 0;
    clearWildcardRegExpCache();
    return matchers;
  }
  #buildMatcher(method) {
    const routes = [];
    let hasOwnRoute = method === METHOD_NAME_ALL;
    [this.#middleware, this.#routes].forEach((r) => {
      const ownRoute = r[method] ? Object.keys(r[method]).map((path) => [path, r[method][path]]) : [];
      if (ownRoute.length !== 0) {
        hasOwnRoute ||= true;
        routes.push(...ownRoute);
      } else if (method !== METHOD_NAME_ALL) {
        routes.push(
          ...Object.keys(r[METHOD_NAME_ALL]).map((path) => [path, r[METHOD_NAME_ALL][path]])
        );
      }
    });
    if (!hasOwnRoute) {
      return null;
    } else {
      return buildMatcherFromPreprocessedRoutes(routes);
    }
  }
};

// node_modules/hono/dist/router/smart-router/router.js
var SmartRouter = class {
  name = "SmartRouter";
  #routers = [];
  #routes = [];
  constructor(init) {
    this.#routers = init.routers;
  }
  add(method, path, handler) {
    if (!this.#routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.#routes.push([method, path, handler]);
  }
  match(method, path) {
    if (!this.#routes) {
      throw new Error("Fatal error");
    }
    const routers = this.#routers;
    const routes = this.#routes;
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router = routers[i];
      try {
        for (let i2 = 0, len2 = routes.length; i2 < len2; i2++) {
          router.add(...routes[i2]);
        }
        res = router.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      this.#routers = [router];
      this.#routes = void 0;
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.#routes || this.#routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.#routers[0];
  }
};

// node_modules/hono/dist/router/trie-router/node.js
var emptyParams = /* @__PURE__ */ Object.create(null);
var hasChildren = (children) => {
  for (const _ in children) {
    return true;
  }
  return false;
};
var Node2 = class _Node2 {
  #methods;
  #children;
  #patterns;
  #order = 0;
  #params = emptyParams;
  constructor(method, handler, children) {
    this.#children = children || /* @__PURE__ */ Object.create(null);
    this.#methods = [];
    if (method && handler) {
      const m = /* @__PURE__ */ Object.create(null);
      m[method] = { handler, possibleKeys: [], score: 0 };
      this.#methods = [m];
    }
    this.#patterns = [];
  }
  insert(method, path, handler) {
    this.#order = ++this.#order;
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const p = parts[i];
      const nextP = parts[i + 1];
      const pattern = getPattern(p, nextP);
      const key = Array.isArray(pattern) ? pattern[0] : p;
      if (key in curNode.#children) {
        curNode = curNode.#children[key];
        if (pattern) {
          possibleKeys.push(pattern[1]);
        }
        continue;
      }
      curNode.#children[key] = new _Node2();
      if (pattern) {
        curNode.#patterns.push(pattern);
        possibleKeys.push(pattern[1]);
      }
      curNode = curNode.#children[key];
    }
    curNode.#methods.push({
      [method]: {
        handler,
        possibleKeys: possibleKeys.filter((v, i, a) => a.indexOf(v) === i),
        score: this.#order
      }
    });
    return curNode;
  }
  #pushHandlerSets(handlerSets, node, method, nodeParams, params) {
    for (let i = 0, len = node.#methods.length; i < len; i++) {
      const m = node.#methods[i];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      const processedSet = {};
      if (handlerSet !== void 0) {
        handlerSet.params = /* @__PURE__ */ Object.create(null);
        handlerSets.push(handlerSet);
        if (nodeParams !== emptyParams || params && params !== emptyParams) {
          for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
            const key = handlerSet.possibleKeys[i2];
            const processed = processedSet[handlerSet.score];
            handlerSet.params[key] = params?.[key] && !processed ? params[key] : nodeParams[key] ?? params?.[key];
            processedSet[handlerSet.score] = true;
          }
        }
      }
    }
  }
  search(method, path) {
    const handlerSets = [];
    this.#params = emptyParams;
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path);
    const curNodesQueue = [];
    const len = parts.length;
    let partOffsets = null;
    for (let i = 0; i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.#children[part];
        if (nextNode) {
          nextNode.#params = node.#params;
          if (isLast) {
            if (nextNode.#children["*"]) {
              this.#pushHandlerSets(handlerSets, nextNode.#children["*"], method, node.#params);
            }
            this.#pushHandlerSets(handlerSets, nextNode, method, node.#params);
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k = 0, len3 = node.#patterns.length; k < len3; k++) {
          const pattern = node.#patterns[k];
          const params = node.#params === emptyParams ? {} : { ...node.#params };
          if (pattern === "*") {
            const astNode = node.#children["*"];
            if (astNode) {
              this.#pushHandlerSets(handlerSets, astNode, method, node.#params);
              astNode.#params = params;
              tempNodes.push(astNode);
            }
            continue;
          }
          const [key, name, matcher] = pattern;
          if (!part && !(matcher instanceof RegExp)) {
            continue;
          }
          const child = node.#children[key];
          if (matcher instanceof RegExp) {
            if (partOffsets === null) {
              partOffsets = new Array(len);
              let offset = path[0] === "/" ? 1 : 0;
              for (let p = 0; p < len; p++) {
                partOffsets[p] = offset;
                offset += parts[p].length + 1;
              }
            }
            const restPathString = path.substring(partOffsets[i]);
            const m = matcher.exec(restPathString);
            if (m) {
              params[name] = m[0];
              this.#pushHandlerSets(handlerSets, child, method, node.#params, params);
              if (hasChildren(child.#children)) {
                child.#params = params;
                const componentCount = m[0].match(/\//)?.length ?? 0;
                const targetCurNodes = curNodesQueue[componentCount] ||= [];
                targetCurNodes.push(child);
              }
              continue;
            }
          }
          if (matcher === true || matcher.test(part)) {
            params[name] = part;
            if (isLast) {
              this.#pushHandlerSets(handlerSets, child, method, params, node.#params);
              if (child.#children["*"]) {
                this.#pushHandlerSets(
                  handlerSets,
                  child.#children["*"],
                  method,
                  params,
                  node.#params
                );
              }
            } else {
              child.#params = params;
              tempNodes.push(child);
            }
          }
        }
      }
      const shifted = curNodesQueue.shift();
      curNodes = shifted ? tempNodes.concat(shifted) : tempNodes;
    }
    if (handlerSets.length > 1) {
      handlerSets.sort((a, b) => {
        return a.score - b.score;
      });
    }
    return [handlerSets.map(({ handler, params }) => [handler, params])];
  }
};

// node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = class {
  name = "TrieRouter";
  #node;
  constructor() {
    this.#node = new Node2();
  }
  add(method, path, handler) {
    const results = checkOptionalParameter(path);
    if (results) {
      for (let i = 0, len = results.length; i < len; i++) {
        this.#node.insert(method, results[i], handler);
      }
      return;
    }
    this.#node.insert(method, path, handler);
  }
  match(method, path) {
    return this.#node.search(method, path);
  }
};

// node_modules/hono/dist/hono.js
var Hono2 = class extends Hono {
  /**
   * Creates an instance of the Hono class.
   *
   * @param options - Optional configuration options for the Hono instance.
   */
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter(), new TrieRouter()]
    });
  }
};

// node_modules/hono/dist/adapter/vercel/handler.js
var handle = (app2) => (req) => {
  return app2.fetch(req);
};

// api/index.ts
var app = new Hono2().basePath("/");
async function routeHandler(c, importFn) {
  try {
    const mod = await importFn();
    const response = await mod.handle(c.req.raw);
    if (!(response instanceof Response) && response.constructor.name !== "Response") {
      return c.json({ message: "Invalid response format" }, 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.json(
      {
        message: e?.message || "Error"
      },
      500
    );
  }
}
app.get(
  "/_api/settings",
  (c) => routeHandler(c, () => Promise.resolve().then(() => (init_settings_GET(), settings_GET_exports)))
);
app.post(
  "/_api/auth/logout",
  (c) => routeHandler(c, () => Promise.resolve().then(() => (init_logout_POST(), logout_POST_exports)))
);
app.get(
  "/_api/auth/session",
  (c) => routeHandler(c, () => Promise.resolve().then(() => (init_session_GET(), session_GET_exports)))
);
app.post(
  "/_api/ai/assistant",
  (c) => routeHandler(c, () => Promise.resolve().then(() => (init_assistant_POST(), assistant_POST_exports)))
);
app.get(
  "/_api/firmware/list",
  (c) => routeHandler(c, () => Promise.resolve().then(() => (init_list_GET(), list_GET_exports)))
);
app.post(
  "/_api/vision/analyze",
  (c) => routeHandler(c, () => Promise.resolve().then(() => (init_analyze_POST(), analyze_POST_exports)))
);
app.post(
  "/_api/settings/update",
  (c) => routeHandler(c, () => Promise.resolve().then(() => (init_update_POST(), update_POST_exports)))
);
app.post(
  "/_api/firmware/install",
  (c) => routeHandler(c, () => Promise.resolve().then(() => (init_install_POST(), install_POST_exports)))
);
app.get(
  "/_api/interactions/list",
  (c) => routeHandler(c, () => Promise.resolve().then(() => (init_list_GET2(), list_GET_exports2)))
);
app.get(
  "/_api/interactions/stats",
  (c) => routeHandler(c, () => Promise.resolve().then(() => (init_stats_GET(), stats_GET_exports)))
);
app.post(
  "/_api/interactions/create",
  (c) => routeHandler(c, () => Promise.resolve().then(() => (init_create_POST(), create_POST_exports)))
);
app.post(
  "/_api/auth/login_with_password",
  (c) => routeHandler(c, () => Promise.resolve().then(() => (init_login_with_password_POST(), login_with_password_POST_exports)))
);
app.post(
  "/_api/auth/register_with_password",
  (c) => routeHandler(c, () => Promise.resolve().then(() => (init_register_with_password_POST(), register_with_password_POST_exports)))
);
var GET = handle(app);
var POST = handle(app);
export {
  GET,
  POST
};
