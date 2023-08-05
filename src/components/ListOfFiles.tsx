import React from "react";

export const ListOfFiles: React.FC<{ selectedFiles: Array<File> }> = ({
  selectedFiles,
}) => {
  const date = (selectedFile: File) =>
    new Date(selectedFile.lastModified).toLocaleString();

  return (
    <>
      <h4 className="mt-4 mb-1 text-2xl font-bold dark:text-white">
        Выбранные файлы
      </h4>
      <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
        {selectedFiles.map((selectedFile, index) => (
          <li
            key={`${selectedFile.name}${index}`}
            className="py-2 sm:pb-4 text-base font-light leading-relaxed"
          >
            <p>Название файла: {selectedFile.name}</p>
            <p>Тип файла: {selectedFile.type}</p>
            <p>Дата последнего изменения: {date(selectedFile)}</p>
          </li>
        ))}
      </ul>
    </>
  );
};
