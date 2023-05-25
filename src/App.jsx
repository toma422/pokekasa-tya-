import React, { useState } from "react";
import "./App.css";
import { pokemon } from "./text.js";
import Select from "react-select";

//カタカナをひらがな
function kanaToHira(str) {
  return str.replace(/[\u30a1-\u30f6]/g, function (match) {
    const chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
}

//クリップボードにコピー
function copyTextToClipboard(text) {
  navigator.clipboard.writeText(text).then(
    function () {
      console.log("Async: Copying to clipboard was successful!");
    },
    function (err) {
      console.error("Async: Could not copy text: ", err);
    }
  );
}

//pokemonをmapで回して、pokemonOptionsに配列として全てのデータを入れる
//データの形が日本語の場合、value:フシギダネ__ふしぎだね label:フシギダネ
const createOptions = (lang) => {
  if (lang === "ja") {
    const pokemonOptions = pokemon.map((pokemonObj) => {
      return {
        value: `${pokemonObj.name_ja}__${kanaToHira(pokemonObj.name_ja)}`,
        label: pokemonObj.name_ja,
      };
    });
    return pokemonOptions;
  } else {
    const pokemonEnOptions = pokemon.map((pokemonObj) => {
      return {
        value: pokemonObj.name_en,
        label: pokemonObj.name_en,
      };
    });
    return pokemonEnOptions;
  }
};

function App() {
  const [option, setOption] = useState([]);
  const [selectValue, setSelectedValue] = useState("ja");
  const [jaResult, setJaResult] = useState("");
  const [enResult, setEnResult] = useState("");
  const [options, setOptions] = useState(createOptions(selectValue));

  //text.jsから見つける関数
  //findでpokemonのデータをpokemonObjに格納する
  //setJaResultでjaResultに反映させる

  const search = (name) => {
    let obj;
    if (selectValue === "ja") {
      obj = pokemon.find((pokemonObj) => pokemonObj.name_ja === name);
    } else {
      obj = pokemon.find((pokemonObj) => pokemonObj.name_en === name);
    }
    setEnResult(obj.name_en);
    setJaResult(obj.name_ja);
  };

  //ラジオボタンを押したとき、createOptionsにjaかenが入りmapを回しデータを格納する。
  //setOptionsでSelectにoptionsを入れて、合うデータをvalueとして渡す
  //setSelectedValueでSelectedValueにjaかenが入る
  const onRadioBtnChanged = (e) => {
    const createdOptions = createOptions(e.target.value);
    setOptions(createdOptions);
    setSelectedValue(e.target.value);
  };

  return (
    <>
      <div>
        <div className="p-4 bg-blue-100">
          <h1 className="font-bold text-4xl">ポケカサーチャー</h1>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <label>
              <input
                checked={"ja" === selectValue}
                type="radio"
                value="ja"
                name="sample"
                onChange={onRadioBtnChanged}
              />
              日本語➡英語
            </label>
            <br />
            <label>
              <input
                checked={"en" === selectValue}
                type="radio"
                value="en"
                name="sample"
                onChange={onRadioBtnChanged}
              />
              英語➡日本語
            </label>
          </div>
          <div className="flex w-full">
            <p className="w-40 flex items-center">カード名</p>
            <Select
              className="w-96"
              value={option}
              onChange={(value) => {
                value && setOption(value);
              }}
              options={options}
              placeholder="検索したいポケモンを入力してください"
            />
          </div>
          <button
            className="btn btn-info py-2 px-3  hover:bg-blue-500 text-white m-1"
            onClick={() => {
              if (option.label) {
                search(option.label);
              } else {
                alert("何かポケモンを選択してください");
              }
            }}
          >
            検索
          </button>
          <button
            className="btn py-2 px-3  hover:bg-gray-500 text-white m-1"
            onClick={() => setOption([])}
          >
            クリア
          </button>
          <br />
          <div className="flex items-center p-1">
            <p className="mr-2 w-36">日本語：{jaResult}</p>
            <div className="tooltip" data-tip="コピーする">
              <button
                className="btn btn-success p-2 w-12"
                onClick={() => copyTextToClipboard(jaResult)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex items-center p-1">
            <p className="mr-[8px] w-36">英語：{enResult}</p>
            <div className="tooltip" data-tip="コピーする">
              <button
                className="btn btn-success p-2 w-12"
                onClick={() => copyTextToClipboard(enResult)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                  />
                </svg>
              </button>
            </div>
          </div>
          <a
            className="link link-info"
            href={`https://www.pokemon-card.com/card-search/index.php?keyword=${jaResult}&se_ta=&regulation_sidebar_form=XY&pg=&illust=&sm_and_keyword=true`}
          >
            トレーナーズウェブサイト
          </a>
        </div>
      </div>
    </>
  );
}

export default App;
