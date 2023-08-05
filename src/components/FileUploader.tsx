import React, { useMemo, useState } from "react";
import axios from "axios";
import { ListOfFiles } from "./ListOfFiles";

const OAUTH_TOKEN = "YOUR_TOKEN";
const OUT_OF_LIMIT =
  "Вы превысили лимит по количеству файлов. На Яндекс.Диск загрузится максимум 100 файлов";
const UPLOAD_URL_ERROR = "Не удалось получить ссылку для загрузки";
const UPLOAD_FILE_ERROR = "Не удалось загрузить файл";

export const FileUploader = () => {
  const [selectedFiles, setSelectedFiles] = useState<Array<File>>([]);
  const filesLimit = 2;

  const uniqueSelectedFiles = useMemo(() => {
    const acc: Record<string, File> = {};
    const uniqueFiles: Array<File> = [];
    for (const file of selectedFiles) {
      if (uniqueFiles.length >= filesLimit) {
        alert(OUT_OF_LIMIT);
        break;
      }
      const key = `${file.name}${file.size}`;
      if (!acc[key]) {
        acc[key] = file;
        uniqueFiles.push(file);
      }
    }
    return uniqueFiles;
  }, [selectedFiles]);

  const disabledChange = uniqueSelectedFiles.length >= filesLimit;
  const disabledUpload = uniqueSelectedFiles.length < 1;
  
  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (
    e,
  ): void => {
    const files = e.target.files;
    if (!files) return;
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const sendFilesToYDisk = async () => {
    for (const file of uniqueSelectedFiles) {
      const formData = new FormData();
      formData.append("file", file);
      let href: null | string = null;
      try {
        const res = await axios.get(
          `https://cloud-api.yandex.net/v1/disk/resources/upload?path=${encodeURIComponent(
            file.name,
          )}`,
          {
            headers: {
              Authorization: OAUTH_TOKEN,
              "Content-Type": "multipart/form-data",
            },
          },
        );
        href = res.data.href;
      } catch (e) {
        console.log(UPLOAD_URL_ERROR, e);
        alert(UPLOAD_URL_ERROR);
      }

      if (href) {
        try {
          const res = await axios.put(href, formData);
          console.log(
            `Результат операции для файла ${file.name}:`,
            res.statusText,
          );
        } catch (e) {
          console.log(UPLOAD_FILE_ERROR, e);
          alert(UPLOAD_FILE_ERROR);
        }
      }
    }
    setSelectedFiles([]);
  };

  return (
    <>
      <div className="flex flex-col">
        <input
          id="file_input"
          type="file"
          className="text-transparent rounded disabled:opacity-75"
          multiple
          onChange={onFileChange}
          disabled={disabledChange}
        />
        <p>Вы можете выбрать от 1 до 100 файлов</p>
      </div>
      <button
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold mt-3 py-2 px-4 rounded inline-flex items-center disabled:opacity-75"
        onClick={sendFilesToYDisk}
        disabled={disabledUpload}
      >
        <svg
          className="fill-current w-4 h-4 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
        </svg>
        <span>Загрузить на Яндекс.Диск</span>
      </button>
      {selectedFiles.length > 0 && (
        <ListOfFiles selectedFiles={uniqueSelectedFiles} />
      )}
    </>
  );
};
