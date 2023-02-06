import { useFormik } from "formik";
import * as Yup from "yup";
import { StringSchema } from "yup";

import { Dispatch, FC, SetStateAction, useState } from "react";
import { useMutation } from "@apollo/client";
import { HiChevronUp, HiChevronDown } from "react-icons/hi";
import Button from "../components/UI/Button";
import FormTextItem from "../components/Form/FormTextItem";
import InputTitle from "../components/Inputs/InputTitle";
import TextVariant from "../components/TextVariant/TextVariant";
import ProjectHeading from "../components/Form/ProjectHeading";
import {
  AnswerModel,
  FieldType,
  ProjectModel,
  ToolCategoryModel,
  ToolModel,
} from "../graphql/types";
import FormSelectItem from "../components/Form/FormSelectItem";
import { MutationType } from "../types/types";
import { GENERATE_ANSWERS } from "../graphql/mutations/generateAnswers";
import Spinner from "../components/UI/Spinner";

interface FormProps {
  tool: ToolModel;
  isEditorOpen: boolean;
  project: ProjectModel;
  allTools: ToolModel[];
  selectCategory: ToolCategoryModel;
  textVariant: AnswerModel[];
  setTextVariant: Dispatch<SetStateAction<AnswerModel[] | null>>;
}

const Form: FC<FormProps> = ({
  isEditorOpen,
  project,
  tool,
  allTools,
  selectCategory,
  setTextVariant,
  textVariant,
}) => {
  const [showQuantityAnswer, setShowQuantityAnswer] = useState<boolean>(false);
  const answers: AnswerModel[] = Object.assign([], textVariant);

  const [showFiveAnswers, setShowFiveAnswers] = useState<AnswerModel[]>(
    answers.reverse().slice(0, 4)
  );

  const [generateAnswersMutation, { loading: generateAnswersLoading, error }] =
    useMutation<MutationType<"generateAnswers">>(GENERATE_ANSWERS, {
      onCompleted: (data) => {
        setTextVariant(answers?.concat(data.generateAnswers));
      },
    });
  console.log(answers);
  const validationObject: { [key: string]: StringSchema } = {};
  tool.fields.forEach((field) => {
    if (field.type === FieldType.Select) {
      validationObject[field.slug] = Yup.string().required("Required");
    } else {
      validationObject[field.slug] = Yup.string()
        .min(2, "Too Short!")
        .max(50, "Too Long!")
        .required("Required");
    }
  });
  const initialValues: { [key: string]: string } = {};
  tool.fields.forEach((field) => {
    initialValues[field.slug] = field.defaultValue;
  });

  const {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormik({
    initialValues,
    isInitialValid: true,
    onSubmit: async (values) => {
      await generateAnswersMutation({
        variables: {
          projectId: project?.id,
          meta: Object.entries(values).map((value) => ({
            key: value[0],
            value: value[1],
          })),
        },
      });
    },
    validationSchema: Yup.object(validationObject),
  });

  const showOtherAnswers = answers.reverse().slice(4);

  return (
    <div
      className={`flex w-full md:border-none border-b-2 border-b-gray-300  items-center content flex-col ${
        isEditorOpen ? "main-content sm:overflow-y-scroll" : "h-full"
      }`}
    >
      <ProjectHeading
        allTools={allTools}
        project={project}
        selectCategory={selectCategory}
      />
      <div
        className={`p-4 md:p-8 2xl:pl-16 pb-0 ${
          isEditorOpen ? "w-full" : "md:w-2/3 lg:w-1/2"
        }`}
      >
        <form onSubmit={handleSubmit} className="flex mx-auto  flex-col">
          <div className="my-5 lg:hidden">
            <InputTitle
              selectProject={project}
              className="bg-transparent focus:ring-0"
            />
          </div>
          {tool.fields.map((field, i) => {
            if (
              field.type === FieldType.MultiLine ||
              field.type === FieldType.SingleLine
            ) {
              return (
                <div key={field.id} className="mb-10">
                  <FormTextItem
                    key={field.id}
                    count={i + 1}
                    label={field.label}
                    id={field.id}
                    name={field.slug}
                    onChangeHandler={handleChange}
                    onBlurHandler={handleBlur}
                    values={values}
                    errors={errors}
                    touched={touched}
                    type={`${
                      field.type === FieldType.MultiLine ? "longtext" : "text"
                    }`}
                  />
                </div>
              );
            }
            return (
              <div key={field.id} className="mb-10">
                <FormSelectItem
                  count={i + 1}
                  key={field.id}
                  id={field.id}
                  label={field.label}
                  name={field.slug}
                  value={field.values ?? null}
                  onChangeHandler={handleChange}
                  values={values}
                  errors={errors}
                  touched={touched}
                />
              </div>
            );
          })}
          <Button
            isLoading={generateAnswersLoading}
            text="Generate content"
            className="mt-11"
            disabled={!isValid}
            submit
          />
        </form>
        {error && (
          <div className="text-red-600 text-center -mb-6">{error.message}</div>
        )}
        {!showQuantityAnswer && (
          <Button
            type="primary"
            text="Show earlier answers"
            className="mx-auto mt-4"
            iconEnd={<HiChevronDown className="h-5 w-5" aria-hidden="true" />}
            onClickHandler={() => setShowQuantityAnswer(true)}
          />
        )}
        {showQuantityAnswer && (
          <div>
            {showOtherAnswers.map((answer, i) => {
              console.log(answer);
              return (
                <TextVariant
                  setShowFiveAnswers={setShowFiveAnswers}
                  key={answer.id}
                  id={answer.id}
                  rate={answer.score}
                  text={answer.text}
                />
              );
            })}
            {showQuantityAnswer && (
              <Button
                type="primary"
                text="Close earlier answers"
                className="mx-auto mt-4"
                iconEnd={<HiChevronUp className="h-5 w-5" aria-hidden="true" />}
                onClickHandler={() => setShowQuantityAnswer(false)}
              />
            )}
          </div>
        )}
        {showFiveAnswers?.map((answer, i) => (
          <TextVariant
            key={answer.id}
            id={answer.id}
            rate={answer.score}
            text={answer.text}
          />
        ))}
      </div>
    </div>
  );
};

export default Form;
