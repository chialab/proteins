# API Reference



**Namespaces**

<a href="#symbolic">Symbolic</a>, <a href="#merge">merge</a>, <a href="#keypath">keypath</a>, <a href="#url">Url</a>, <a href="#factory">Factory</a>, <a href="#proto">Proto</a>


**Classes**

<a href="#observable">Observable</a>


**Methods**

<a href="#has">has</a>, <a href="#symbolic">Symbolic</a>, <a href="#clone">clone</a>, <a href="#merge">merge</a>, <a href="#equivalent">equivalent</a>, <a href="#mix">mix</a>, <a href="#isfunction">isFunction</a>, <a href="#isstring">isString</a>, <a href="#isnumber">isNumber</a>, <a href="#isboolean">isBoolean</a>, <a href="#isdate">isDate</a>, <a href="#isobject">isObject</a>, <a href="#isundefined">isUndefined</a>, <a href="#isarray">isArray</a>, <a href="#isfalsy">isFalsy</a>, <a href="#on">on</a>, <a href="#off">off</a>, <a href="#trigger">trigger</a>








<hr />

<strong id="symbolic"><code>namespace</code>  Symbolic</strong>













**Constants**

<a href="#issymbolic">isSymbolic</a>






<hr />

<details>
<summary><strong id="issymbolic"><code>constant</code>  isSymbolic</strong></summary><br />







<strong>Type:</strong>

<pre>(sym: Symbol|<a href="#symbolic">Symbolic</a>): boolean</pre>



</details>

<hr />

<strong id="merge"><code>namespace</code>  merge</strong>













**Constants**

<a href="#config">config</a>






<hr />

<details>
<summary><strong id="config"><code>constant</code>  config</strong></summary><br />







<strong>Type:</strong>

<pre>(options?: {
    mergeObjects: boolean;
    joinArrays: boolean;
    strictMerge: boolean;
}): Function</pre>



</details>

<hr />

<strong id="keypath"><code>namespace</code>  keypath</strong>











**Methods**

<a href="#get">get</a>, <a href="#set">set</a>, <a href="#has">has</a>, <a href="#ensure">ensure</a>, <a href="#insert">insert</a>, <a href="#empty">empty</a>, <a href="#del">del</a>








<hr />

<details>
<summary><strong id="get"><code>method</code>  get</strong></summary><br />



<p>

Get a deep property of an object using paths

</p>

<details>
<summary>
<code>(obj: any, path: string|any[], defaultValue: any): any</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>obj</td>
            <td><code>any</code></td>
            <td align="center"></td>
            <td>The object scope</td></tr>
<tr>
            <td>path</td>
            <td><code>string|any[]</code></td>
            <td align="center"></td>
            <td>The path of the property to retrieve</td></tr>
<tr>
            <td>defaultValue</td>
            <td><code>any</code></td>
            <td align="center"></td>
            <td>The default value returned if path was not found. Default is undefined.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>any</code> The property value

<br />
</details>





</details>

<hr />

<details>
<summary><strong id="set"><code>method</code>  set</strong></summary><br />



<p>

Set a deep property of an object using paths

</p>

<details>
<summary>
<code>(obj: any, path: string|any[], value: any, ensure?: boolean): any</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>obj</td>
            <td><code>any</code></td>
            <td align="center"></td>
            <td>The object scope</td></tr>
<tr>
            <td>path</td>
            <td><code>string|any[]</code></td>
            <td align="center"></td>
            <td>The path of the property to set</td></tr>
<tr>
            <td>value</td>
            <td><code>any</code></td>
            <td align="center"></td>
            <td>The value to set</td></tr>
<tr>
            <td>ensure</td>
            <td><code>boolean</code></td>
            <td align="center">✓</td>
            <td>Create path if does not exists</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>any</code> The property value

<br />
</details>





</details>

<hr />

<details>
<summary><strong id="has"><code>method</code>  has</strong></summary><br />



<p>

Check deep object property existence using paths

</p>

<details>
<summary>
<code>(obj: any, path: string|any[]): boolean</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>obj</td>
            <td><code>any</code></td>
            <td align="center"></td>
            <td>The object scope</td></tr>
<tr>
            <td>path</td>
            <td><code>string|any[]</code></td>
            <td align="center"></td>
            <td>The path of the property to retrieve</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>boolean</code> The property exists or not

<br />
</details>





</details>

<hr />

<details>
<summary><strong id="ensure"><code>method</code>  ensure</strong></summary><br />



<p>

Ensure the existance of a value for the given path.
If the value already exists, do nothing.

</p>

<details>
<summary>
<code>(obj: any, path: string|any[], value: any): any</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>obj</td>
            <td><code>any</code></td>
            <td align="center"></td>
            <td>The object scope</td></tr>
<tr>
            <td>path</td>
            <td><code>string|any[]</code></td>
            <td align="center"></td>
            <td>The path of the property to retrieve</td></tr>
<tr>
            <td>value</td>
            <td><code>any</code></td>
            <td align="center"></td>
            <td>The default value to set</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>any</code> The actual value for the given property

<br />
</details>





</details>

<hr />

<details>
<summary><strong id="insert"><code>method</code>  insert</strong></summary><br />



<p>

Push or insert a value in array.

</p>

<details>
<summary>
<code>(obj: any, path: string|any[], value: any, index?: number): any[]</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>obj</td>
            <td><code>any</code></td>
            <td align="center"></td>
            <td>The object scope</td></tr>
<tr>
            <td>path</td>
            <td><code>string|any[]</code></td>
            <td align="center"></td>
            <td>The path of the property to retrieve</td></tr>
<tr>
            <td>value</td>
            <td><code>any</code></td>
            <td align="center"></td>
            <td>The value to push</td></tr>
<tr>
            <td>index</td>
            <td><code>number</code></td>
            <td align="center">✓</td>
            <td>The index to replace (empty, push at the end)</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>any[]</code> The modified array

<br />
</details>





</details>

<hr />

<details>
<summary><strong id="empty"><code>method</code>  empty</strong></summary><br />



<p>

Reset the value at the given path.
 Object → remove all keys from the object
 Array → remove all values from the array
 String → reset to empty string
 Number → reset to 0
 any → reset to null

</p>

<details>
<summary>
<code>(obj: any, path: string|any[]): any</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>obj</td>
            <td><code>any</code></td>
            <td align="center"></td>
            <td>The object scope</td></tr>
<tr>
            <td>path</td>
            <td><code>string|any[]</code></td>
            <td align="center"></td>
            <td>The path of the property to retrieve</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>any</code> The modified object

<br />
</details>





</details>

<hr />

<details>
<summary><strong id="del"><code>method</code>  del</strong></summary><br />



<p>

Remove a key from the parent path.

</p>

<details>
<summary>
<code>(obj: any, path: string|any[]): any</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>obj</td>
            <td><code>any</code></td>
            <td align="center"></td>
            <td>The object scope</td></tr>
<tr>
            <td>path</td>
            <td><code>string|any[]</code></td>
            <td align="center"></td>
            <td>The path of the property to retrieve</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>any</code> The parent path object

<br />
</details>





</details>

<hr />

<strong id="url"><code>namespace</code>  Url</strong>









**Classes**

<a href="#searchparams">SearchParams</a>, <a href="#url">Url</a>


**Methods**

<a href="#parse">parse</a>, <a href="#serialize">serialize</a>, <a href="#unserialize">unserialize</a>, <a href="#join">join</a>, <a href="#resolve">resolve</a>, <a href="#isabsoluteurl">isAbsoluteUrl</a>, <a href="#isdataurl">isDataUrl</a>, <a href="#islocalurl">isLocalUrl</a>








<hr />

<details>
<summary><strong id="searchparams"><code>class</code>  SearchParams</strong></summary><br />
    




<p>

Search params interface for Url.

</p>





<strong>Methods</strong>

<strong><code>method</code>  constructor</strong>





<details>
<summary>
<code>(ref: any)</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>ref</td>
            <td><code>any</code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>



<br />
</details>





<br />

<strong id="keys"><code>method</code>  keys</strong>



<p>

List all entry keys.

</p>

<details>
<summary>
<code>(): any[]</code>
</summary><br />





<strong>Returns</strong>: <code>any[]</code> Entry keys list.

<br />
</details>





<br />

<strong id="values"><code>method</code>  values</strong>



<p>

List all entry values.

</p>

<details>
<summary>
<code>(): any[]</code>
</summary><br />





<strong>Returns</strong>: <code>any[]</code> Entry values list.

<br />
</details>





<br />

<strong id="entries"><code>method</code>  entries</strong>



<p>

List all entries.

</p>

<details>
<summary>
<code>(): any[]</code>
</summary><br />





<strong>Returns</strong>: <code>any[]</code> Entries list in format [[key, value], [...]].

<br />
</details>





<br />

<strong id="get"><code>method</code>  get</strong>



<p>

Retrieve an entry.

</p>

<details>
<summary>
<code>(name: string): any</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>name</td>
            <td><code>string</code></td>
            <td align="center"></td>
            <td>The entity name to get.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>any</code> The entity value.

<br />
</details>





<br />

<strong id="has"><code>method</code>  has</strong>



<p>

Check if entity is defined.

</p>

<details>
<summary>
<code>(name: string): boolean</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>name</td>
            <td><code>string</code></td>
            <td align="center"></td>
            <td>The entity name to check.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>boolean</code> 

<br />
</details>





<br />

<strong id="set"><code>method</code>  set</strong>



<p>

Set an entry value.

</p>

<details>
<summary>
<code>(name: string, value: any): void</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>name</td>
            <td><code>string</code></td>
            <td align="center"></td>
            <td>The entity name to set.</td></tr>
<tr>
            <td>value</td>
            <td><code>any</code></td>
            <td align="center"></td>
            <td>The entity value to set</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>void</code> 

<br />
</details>





<br />

<strong id="delete"><code>method</code>  delete</strong>



<p>

Remove an entity from the search params.

</p>

<details>
<summary>
<code>(name: string): void</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>name</td>
            <td><code>string</code></td>
            <td align="center"></td>
            <td>The entity name to remove.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>void</code> 

<br />
</details>





<br />

<strong id="sort"><code>method</code>  sort</strong>



<p>

Sort entities by keys names.

</p>

<details>
<summary>
<code>(): void</code>
</summary><br />





<strong>Returns</strong>: <code>void</code> 

<br />
</details>





<br />

<strong id="tostring"><code>method</code>  toString</strong>





<details>
<summary>
<code>(): string</code>
</summary><br />





<strong>Returns</strong>: <code>string</code> 

<br />
</details>













</details>

<hr />

<details>
<summary><strong id="url"><code>class</code>  Url</strong></summary><br />
    




<p>

Url helper class.

</p>



<strong>Properties</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Readonly</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>searchParams</td>
            <td><code><a href="#searchparams">SearchParams</a></code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>protocol</td>
            <td><code>string</code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>username</td>
            <td><code>string</code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>password</td>
            <td><code>string</code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>host</td>
            <td><code>string</code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>hostname</td>
            <td><code>string</code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>port</td>
            <td><code>string</code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>search</td>
            <td><code>string</code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>hash</td>
            <td><code>string</code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>


<strong>Methods</strong>

<strong><code>method</code>  constructor</strong>





<details>
<summary>
<code>(path: any, baseUrl: any)</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>path</td>
            <td><code>any</code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>baseUrl</td>
            <td><code>any</code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>



<br />
</details>





<br />

<strong id="join"><code>method</code>  join</strong>



<p>

Join current Url with paths.

</p>

<details>
<summary>
<code>(paths: string[]): <a href="#url">Url</a></code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>paths</td>
            <td><code>string[]</code></td>
            <td align="center"></td>
            <td>A list of paths to join.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code><a href="#url">Url</a></code> A new url instance.

<br />
</details>





<br />

<strong id="resolve"><code>method</code>  resolve</strong>



<p>

Resolve a path relative to the current Url.

</p>

<details>
<summary>
<code>(path: string): <a href="#url">Url</a></code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>path</td>
            <td><code>string</code></td>
            <td align="center"></td>
            <td>The relative path.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code><a href="#url">Url</a></code> A new url instance.

<br />
</details>





<br />

<strong id="isabsoluteurl"><code>method</code>  isAbsoluteUrl</strong>



<p>

Check if current Url is absolute.

</p>

<details>
<summary>
<code>(): boolean</code>
</summary><br />





<strong>Returns</strong>: <code>boolean</code> 

<br />
</details>





<br />

<strong id="isdataurl"><code>method</code>  isDataUrl</strong>



<p>

Check if current Url is a data url.

</p>

<details>
<summary>
<code>(): boolean</code>
</summary><br />





<strong>Returns</strong>: <code>boolean</code> 

<br />
</details>





<br />

<strong id="islocalurl"><code>method</code>  isLocalUrl</strong>



<p>

Check if current Url points to local file.

</p>

<details>
<summary>
<code>(): boolean</code>
</summary><br />





<strong>Returns</strong>: <code>boolean</code> 

<br />
</details>





<br />

<strong id="tostring"><code>method</code>  toString</strong>





<details>
<summary>
<code>(): string</code>
</summary><br />





<strong>Returns</strong>: <code>string</code> 

<br />
</details>













</details>

<hr />

<details>
<summary><strong id="parse"><code>method</code>  parse</strong></summary><br />



<p>

Parse and split an url in its components.

</p>

<details>
<summary>
<code>(url?: string): any</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>url</td>
            <td><code>string</code></td>
            <td align="center">✓</td>
            <td>The url to parse.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>any</code> The url properties.

<br />
</details>





</details>

<hr />

<details>
<summary><strong id="serialize"><code>method</code>  serialize</strong></summary><br />



<p>

Serialize an object in FormData format.

</p>

<details>
<summary>
<code>(obj: any, prefix: string, chunkFn?: Function): string</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>obj</td>
            <td><code>any</code></td>
            <td align="center"></td>
            <td>The object to convert.</td></tr>
<tr>
            <td>prefix</td>
            <td><code>string</code></td>
            <td align="center"></td>
            <td>The prefix to use in case of recursion.</td></tr>
<tr>
            <td>chunkFn</td>
            <td><code>Function</code></td>
            <td align="center">✓</td>
            <td>The callback function to use for chunking a key/value pair.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>string</code> An object to serialize.

<br />
</details>





</details>

<hr />

<details>
<summary><strong id="unserialize"><code>method</code>  unserialize</strong></summary><br />



<p>

Unserialize a string in FormData format to an object.

</p>

<details>
<summary>
<code>(str: string): any</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>str</td>
            <td><code>string</code></td>
            <td align="center"></td>
            <td>A search string to unserialize.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>any</code> The unserialized object.

<br />
</details>





</details>

<hr />

<details>
<summary><strong id="join"><code>method</code>  join</strong></summary><br />



<p>

Join url paths.

</p>

<details>
<summary>
<code>(paths: string[]): string</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>paths</td>
            <td><code>string[]</code></td>
            <td align="center"></td>
            <td>A list of paths to join.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>string</code> The final joint string.

<br />
</details>





</details>

<hr />

<details>
<summary><strong id="resolve"><code>method</code>  resolve</strong></summary><br />



<p>

Resolve relative url path.

</p>

<details>
<summary>
<code>(base: string, relative: string): string</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>base</td>
            <td><code>string</code></td>
            <td align="center"></td>
            <td>The base path.</td></tr>
<tr>
            <td>relative</td>
            <td><code>string</code></td>
            <td align="center"></td>
            <td>The relative path.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>string</code> The rsolved path.

<br />
</details>





</details>

<hr />

<details>
<summary><strong id="isabsoluteurl"><code>method</code>  isAbsoluteUrl</strong></summary><br />



<p>

Check if an url is absolute.

</p>

<details>
<summary>
<code>(url: string): boolean</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>url</td>
            <td><code>string</code></td>
            <td align="center"></td>
            <td>The url to check.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>boolean</code> 

<br />
</details>





</details>

<hr />

<details>
<summary><strong id="isdataurl"><code>method</code>  isDataUrl</strong></summary><br />



<p>

Check if an url is a data url.

</p>

<details>
<summary>
<code>(url: string): boolean</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>url</td>
            <td><code>string</code></td>
            <td align="center"></td>
            <td>The url to check.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>boolean</code> 

<br />
</details>





</details>

<hr />

<details>
<summary><strong id="islocalurl"><code>method</code>  isLocalUrl</strong></summary><br />



<p>

Check if an url points to a local file.

</p>

<details>
<summary>
<code>(url: string): boolean</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>url</td>
            <td><code>string</code></td>
            <td align="center"></td>
            <td>The url to check.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>boolean</code> 

<br />
</details>





</details>

<hr />

<strong id="factory"><code>namespace</code>  Factory</strong>









**Classes**

<a href="#basefactory">BaseFactory</a>, <a href="#emitter">Emitter</a>, <a href="#configurable">Configurable</a>, <a href="#factory">Factory</a>




**Constants**

<a href="#context_sym">CONTEXT_SYM</a>, <a href="#config_sym">CONFIG_SYM</a>, <a href="#listeners_sym">LISTENERS_SYM</a>, <a href="#factorymixin">FactoryMixin</a>, <a href="#emittermixin">EmitterMixin</a>, <a href="#configurablemixin">ConfigurableMixin</a>, <a href="#injectablemixin">InjectableMixin</a>






<hr />

<details>
<summary><strong id="basefactory"><code>class</code>  BaseFactory</strong></summary><br />
    


<strong>Extends:</strong> <a href="#basefactory_base">BaseFactory_base</a>















</details>

<hr />

<details>
<summary><strong id="emitter"><code>class</code>  Emitter</strong></summary><br />
    


<strong>Extends:</strong> <a href="#emitter_base">Emitter_base</a>















</details>

<hr />

<details>
<summary><strong id="configurable"><code>class</code>  Configurable</strong></summary><br />
    


<strong>Extends:</strong> <a href="#configurable_base">Configurable_base</a>















</details>

<hr />

<details>
<summary><strong id="factory"><code>class</code>  Factory</strong></summary><br />
    


<strong>Extends:</strong> <a href="#factory_base">Factory_base</a>















</details>

<hr />

<details>
<summary><strong id="context_sym"><code>constant</code>  CONTEXT_SYM</strong></summary><br />



<p>

Symbol for Factory context.

</p>



<strong>Type:</strong>

<pre><a href="#symbolic">Symbolic</a></pre>



</details>

<hr />

<details>
<summary><strong id="config_sym"><code>constant</code>  CONFIG_SYM</strong></summary><br />



<p>

Symbol for Factory configuration.

</p>



<strong>Type:</strong>

<pre><a href="#symbolic">Symbolic</a></pre>



</details>

<hr />

<details>
<summary><strong id="listeners_sym"><code>constant</code>  LISTENERS_SYM</strong></summary><br />



<p>

Symbol for Factory listeners.

</p>



<strong>Type:</strong>

<pre><a href="#symbolic">Symbolic</a></pre>



</details>

<hr />

<details>
<summary><strong id="factorymixin"><code>constant</code>  FactoryMixin</strong></summary><br />



<p>

Base Factory mixin.

</p>



<strong>Type:</strong>

<pre>(SuperClass: Function): Function</pre>



</details>

<hr />

<details>
<summary><strong id="emittermixin"><code>constant</code>  EmitterMixin</strong></summary><br />



<p>

Events emitter mixin.

</p>



<strong>Type:</strong>

<pre>(SuperClass: Function): Function</pre>



</details>

<hr />

<details>
<summary><strong id="configurablemixin"><code>constant</code>  ConfigurableMixin</strong></summary><br />



<p>

Configurable mixin.

</p>



<strong>Type:</strong>

<pre>(SuperClass: Function): Function</pre>



</details>

<hr />

<details>
<summary><strong id="injectablemixin"><code>constant</code>  InjectableMixin</strong></summary><br />



<p>

Mixin for other multiple injections.

</p>



<strong>Type:</strong>

<pre>(SuperClass: Function): Function</pre>



</details>

<hr />

<strong id="proto"><code>namespace</code>  Proto</strong>











**Methods**

<a href="#walk">walk</a>, <a href="#entries">entries</a>, <a href="#methods">methods</a>, <a href="#properties">properties</a>, <a href="#reduce">reduce</a>, <a href="#has">has</a>, <a href="#get">get</a>, <a href="#set">set</a>, <a href="#extend">extend</a>, <a href="#reconstruct">reconstruct</a>








<hr />

<details>
<summary><strong id="walk"><code>method</code>  walk</strong></summary><br />



<p>

Iterate all prototype chain of a class.

</p>

<details>
<summary>
<code>(Ctr: Function, callback?: Function): string[]</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>Ctr</td>
            <td><code>Function</code></td>
            <td align="center"></td>
            <td>The class to iterate.</td></tr>
<tr>
            <td>callback</td>
            <td><code>Function</code></td>
            <td align="center">✓</td>
            <td>A callback function for each prototype.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>string[]</code> 

<br />
</details>





</details>

<hr />

<details>
<summary><strong id="entries"><code>method</code>  entries</strong></summary><br />



<p>

Retrieve a list of properties and methods (with their descriptors) for the class.

</p>

<details>
<summary>
<code>(Ctr: Function, filter?: Function): any</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>Ctr</td>
            <td><code>Function</code></td>
            <td align="center"></td>
            <td>The class to analyze.</td></tr>
<tr>
            <td>filter</td>
            <td><code>Function</code></td>
            <td align="center">✓</td>
            <td>A filter function for the property.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>any</code> 

<br />
</details>





</details>

<hr />

<details>
<summary><strong id="methods"><code>method</code>  methods</strong></summary><br />



<p>

Retrieve definitions of methods for the class.

</p>

<details>
<summary>
<code>(Ctr: Function): string[]</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>Ctr</td>
            <td><code>Function</code></td>
            <td align="center"></td>
            <td>The class to analyze.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>string[]</code> 

<br />
</details>





</details>

<hr />

<details>
<summary><strong id="properties"><code>method</code>  properties</strong></summary><br />



<p>

Retrieve definitions of properties for the class.

</p>

<details>
<summary>
<code>(Ctr: Function): any</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>Ctr</td>
            <td><code>Function</code></td>
            <td align="center"></td>
            <td>The class to analyze.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>any</code> 

<br />
</details>





</details>

<hr />

<details>
<summary><strong id="reduce"><code>method</code>  reduce</strong></summary><br />



<p>

Get all definitions for a given property in the prototype chain.

</p>

<details>
<summary>
<code>(Ctr: Function, property: string): any[]</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>Ctr</td>
            <td><code>Function</code></td>
            <td align="center"></td>
            <td>The class to analyze.</td></tr>
<tr>
            <td>property</td>
            <td><code>string</code></td>
            <td align="center"></td>
            <td>The property name to collect.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>any[]</code> 

<br />
</details>





</details>

<hr />

<details>
<summary><strong id="has"><code>method</code>  has</strong></summary><br />



<p>

Check if a method or a property is in the prototype chain.

</p>

<details>
<summary>
<code>(Ctr: Function, property: string): boolean</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>Ctr</td>
            <td><code>Function</code></td>
            <td align="center"></td>
            <td>The class to analyze.</td></tr>
<tr>
            <td>property</td>
            <td><code>string</code></td>
            <td align="center"></td>
            <td>The property name to verify.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>boolean</code> 

<br />
</details>





</details>

<hr />

<details>
<summary><strong id="get"><code>method</code>  get</strong></summary><br />



<p>

Retrieve prototype of an object.

</p>

<details>
<summary>
<code>(obj: any): any</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>obj</td>
            <td><code>any</code></td>
            <td align="center"></td>
            <td>The object to analyze.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>any</code> The prototype.

<br />
</details>





</details>

<hr />

<details>
<summary><strong id="set"><code>method</code>  set</strong></summary><br />



<p>

Set prototype to an object.

</p>

<details>
<summary>
<code>(obj: any, proto: any): void</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>obj</td>
            <td><code>any</code></td>
            <td align="center"></td>
            <td>The object to update.</td></tr>
<tr>
            <td>proto</td>
            <td><code>any</code></td>
            <td align="center"></td>
            <td>The prototype or the class to use.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>void</code> 

<br />
</details>





</details>

<hr />

<details>
<summary><strong id="extend"><code>method</code>  extend</strong></summary><br />



<p>

Extend a prototype.

</p>

<details>
<summary>
<code>(proto1: any, proto2: any): any</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>proto1</td>
            <td><code>any</code></td>
            <td align="center"></td>
            <td>The prototype to extend.</td></tr>
<tr>
            <td>proto2</td>
            <td><code>any</code></td>
            <td align="center"></td>
            <td>The prototype to use.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>any</code> The new prototype.

<br />
</details>





</details>

<hr />

<details>
<summary><strong id="reconstruct"><code>method</code>  reconstruct</strong></summary><br />



<p>

Create a new instance of an object without constructor.

</p>

<details>
<summary>
<code>(Ctr: any): any</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>Ctr</td>
            <td><code>any</code></td>
            <td align="center"></td>
            <td>The class or the prototype to reconstruct.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>any</code> The new instance.

<br />
</details>





</details>

<hr />

<strong id="observable"><code>class</code>  Observable</strong>
    




<p>

Create an Observable object for a set of data or an array.

</p>





<strong>Methods</strong>

<strong><code>method</code>  constructor</strong>





<details>
<summary>
<code>(data: any)</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>data</td>
            <td><code>any</code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>



<br />
</details>









<strong>Static methods</strong>

<strong id="reobserve"><code>method</code>  reobserve</strong>



<p>

Re-observe an array or an object after adding a property.

You should invoke this static method only after adding a new property
to an object, and only if you wish to support browsers that do not have
native Proxy object. This is required because it is impossible to
intercept new properties added to an existing object from the polyfill.

## Example

```js
const myObservable = new Observable({ foo: 'foo' });

// This is not enough to trigger changes in older browsers!
myObservable.bar = 'bar';

// So, you should invoke this immediately after:
Observable.reobserve(myObservable);
```

</p>

<details>
<summary>
<code>(data: any): void</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>data</td>
            <td><code>any</code></td>
            <td align="center"></td>
            <td>Data to be re-observed.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>void</code> 

<br />
</details>










<hr />

<strong id="mixinscope"><code>class</code>  MixinScope</strong>
    




<p>

A Mixin helper class.

</p>





<strong>Methods</strong>

<strong id="with"><code>method</code>  with</strong>



<p>

Mix the super class with a list of mixins.

</p>

<details>
<summary>
<code>(mixins: Function[]): Function</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>mixins</td>
            <td><code>Function[]</code></td>
            <td align="center"></td>
            <td>N* mixin functions.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>Function</code> The extended class.

<br />
</details>





<br />

<strong id="has"><code>method</code>  has</strong>



<p>

Check if the SuperClass has been already mixed with a mixin function.

</p>

<details>
<summary>
<code>(mixin: Function): boolean</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>mixin</td>
            <td><code>Function</code></td>
            <td align="center"></td>
            <td>The mixin function.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>boolean</code> 

<br />
</details>














<hr />

<strong id="has"><code>method</code>  has</strong>



<p>

Exec Object.prototype.hasOwnProperty against an object.

</p>

<details>
<summary>
<code>(scope: any, property: string): boolean</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>scope</td>
            <td><code>any</code></td>
            <td align="center"></td>
            <td>The scope object to check.</td></tr>
<tr>
            <td>property</td>
            <td><code>string</code></td>
            <td align="center"></td>
            <td>The property name to check.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>boolean</code> 

<br />
</details>






<hr />

<strong id="symbolic"><code>method</code>  Symbolic</strong>



<p>

Create a symbolic key for objects's properties.

</p>

<details>
<summary>
<code>(property: string): Symbol|<a href="#symbolic">Symbolic</a></code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>property</td>
            <td><code>string</code></td>
            <td align="center"></td>
            <td>The Symbol name.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>Symbol|<a href="#symbolic">Symbolic</a></code> 

<br />
</details>






<hr />

<strong id="clone"><code>method</code>  clone</strong>



<p>

Clone an object.

</p>

<details>
<summary>
<code>(obj: any, callback?: Function, useStrict?: boolean, cache?: WeakMap&lt;any, any&gt;): any</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>obj</td>
            <td><code>any</code></td>
            <td align="center"></td>
            <td>The instance to clone.</td></tr>
<tr>
            <td>callback</td>
            <td><code>Function</code></td>
            <td align="center">✓</td>
            <td>A modifier function for each property.</td></tr>
<tr>
            <td>useStrict</td>
            <td><code>boolean</code></td>
            <td align="center">✓</td>
            <td>Should preserve frozen and sealed objects.</td></tr>
<tr>
            <td>cache</td>
            <td><code>WeakMap&lt;any, any&gt;</code></td>
            <td align="center">✓</td>
            <td>The cache for circular references.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>any</code> The clone of the object.

<br />
</details>






<hr />

<strong id="merge"><code>method</code>  merge</strong>



<p>

Merge two objects into a new one.

</p>

<details>
<summary>
<code>(objects: any[]): any</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>objects</td>
            <td><code>any[]</code></td>
            <td align="center"></td>
            <td>The objects to merge.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>any</code> The merged object.

<br />
</details>






<hr />

<strong id="equivalent"><code>method</code>  equivalent</strong>



<p>

Recursive objects equivalence check.

</p>

<details>
<summary>
<code>(obj1: any, obj2: any): boolean</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>obj1</td>
            <td><code>any</code></td>
            <td align="center"></td>
            <td>The original object.</td></tr>
<tr>
            <td>obj2</td>
            <td><code>any</code></td>
            <td align="center"></td>
            <td>The object to compare</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>boolean</code> 

<br />
</details>






<hr />

<strong id="mix"><code>method</code>  mix</strong>



<p>

Mix a class with a mixin.
Inspired by Justin Fagnani (https://github.com/justinfagnani).

</p>

<details>
<summary>
<code>(SuperClass: Function): <a href="#mixinscope">MixinScope</a></code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>SuperClass</td>
            <td><code>Function</code></td>
            <td align="center"></td>
            <td>The class to extend.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code><a href="#mixinscope">MixinScope</a></code> A MixinScope instance.

<br />
</details>






<hr />

<strong id="isfunction"><code>method</code>  isFunction</strong>



<p>

Check if a value is a function.

</p>

<details>
<summary>
<code>(obj: any): boolean</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>obj</td>
            <td><code>any</code></td>
            <td align="center"></td>
            <td>The value to check.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>boolean</code> 

<br />
</details>






<hr />

<strong id="isstring"><code>method</code>  isString</strong>



<p>

Check if a value is a string.

</p>

<details>
<summary>
<code>(obj: any): boolean</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>obj</td>
            <td><code>any</code></td>
            <td align="center"></td>
            <td>The value to check.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>boolean</code> 

<br />
</details>






<hr />

<strong id="isnumber"><code>method</code>  isNumber</strong>



<p>

Check if a value is a number.

</p>

<details>
<summary>
<code>(obj: any): boolean</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>obj</td>
            <td><code>any</code></td>
            <td align="center"></td>
            <td>The value to check.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>boolean</code> 

<br />
</details>






<hr />

<strong id="isboolean"><code>method</code>  isBoolean</strong>



<p>

Check if a value is a bool.

</p>

<details>
<summary>
<code>(obj: any): boolean</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>obj</td>
            <td><code>any</code></td>
            <td align="center"></td>
            <td>The value to check.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>boolean</code> 

<br />
</details>






<hr />

<strong id="isdate"><code>method</code>  isDate</strong>



<p>

Check if a value is a date.

</p>

<details>
<summary>
<code>(obj: any): boolean</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>obj</td>
            <td><code>any</code></td>
            <td align="center"></td>
            <td>The value to check.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>boolean</code> 

<br />
</details>






<hr />

<strong id="isobject"><code>method</code>  isObject</strong>



<p>

Check if a value is an object.

</p>

<details>
<summary>
<code>(obj: any): boolean</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>obj</td>
            <td><code>any</code></td>
            <td align="center"></td>
            <td>The value to check.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>boolean</code> 

<br />
</details>






<hr />

<strong id="isundefined"><code>method</code>  isUndefined</strong>



<p>

Check if a value is undefined.

</p>

<details>
<summary>
<code>(obj: any): boolean</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>obj</td>
            <td><code>any</code></td>
            <td align="center"></td>
            <td>The value to check.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>boolean</code> 

<br />
</details>






<hr />

<strong id="isarray"><code>method</code>  isArray</strong>



<p>

Check if a value is an array.

</p>

<details>
<summary>
<code>(obj: any): boolean</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>obj</td>
            <td><code>any</code></td>
            <td align="center"></td>
            <td>The value to check.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>boolean</code> 

<br />
</details>






<hr />

<strong id="isfalsy"><code>method</code>  isFalsy</strong>



<p>

Check if falsy value.

</p>

<details>
<summary>
<code>(obj: any): boolean</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>obj</td>
            <td><code>any</code></td>
            <td align="center"></td>
            <td>The value to check.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>boolean</code> 

<br />
</details>






<hr />

<strong id="on"><code>method</code>  on</strong>



<p>

Add a callback for the specified trigger.

</p>

<details>
<summary>
<code>(scope: any, name: string, callback: Function): Function</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>scope</td>
            <td><code>any</code></td>
            <td align="center"></td>
            <td>The event scope</td></tr>
<tr>
            <td>name</td>
            <td><code>string</code></td>
            <td align="center"></td>
            <td>The event name</td></tr>
<tr>
            <td>callback</td>
            <td><code>Function</code></td>
            <td align="center"></td>
            <td>The callback function</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>Function</code> Destroy created listener with this function

<br />
</details>






<hr />

<strong id="off"><code>method</code>  off</strong>



<p>

Remove one or multiple listeners.

</p>

<details>
<summary>
<code>(scope: any, name?: string, callback?: Function): void</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>scope</td>
            <td><code>any</code></td>
            <td align="center"></td>
            <td>The event scope</td></tr>
<tr>
            <td>name</td>
            <td><code>string</code></td>
            <td align="center">✓</td>
            <td>Optional event name to reset</td></tr>
<tr>
            <td>callback</td>
            <td><code>Function</code></td>
            <td align="center">✓</td>
            <td>Callback to remove (empty, removes all listeners).</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>void</code> 

<br />
</details>






<hr />

<strong id="trigger"><code>method</code>  trigger</strong>



<p>

Trigger a callback.

</p>

<details>
<summary>
<code>(scope: any, name: string, args?: any[]): Promise&lt;any&gt;</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>scope</td>
            <td><code>any</code></td>
            <td align="center"></td>
            <td>The event scope</td></tr>
<tr>
            <td>name</td>
            <td><code>string</code></td>
            <td align="center"></td>
            <td>Event name</td></tr>
<tr>
            <td>args</td>
            <td><code>any[]</code></td>
            <td align="center">✓</td>
            <td>Arguments to pass to callbacks</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>Promise&lt;any&gt;</code> The final Promise of the callbacks chain

<br />
</details>






<hr />

<strong id="basefactory_base"><code>constant</code>  BaseFactory_base</strong>







<strong>Type:</strong>

<pre>any</pre>




<hr />

<strong id="emitter_base"><code>constant</code>  Emitter_base</strong>







<strong>Type:</strong>

<pre>any</pre>




<hr />

<strong id="configurable_base"><code>constant</code>  Configurable_base</strong>







<strong>Type:</strong>

<pre>any</pre>




<hr />

<strong id="factory_base"><code>constant</code>  Factory_base</strong>







<strong>Type:</strong>

<pre>any</pre>


