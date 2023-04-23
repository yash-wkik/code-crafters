import { ChallengeType, Difficulty } from "@prisma/client";
import type { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import { useForm, type SubmitHandler } from "react-hook-form";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import {
  useDropzone,
} from "react-dropzone";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import {
  codeLive,
  codePreview,
  codeEdit,
} from "@uiw/react-md-editor/lib/commands";
import { getServerAuthSession } from "~/server/auth";
import DropZoneInput from "~/components/DropZoneInput";
import { uploadToCloudinary } from "~/utils/helpers";
import PageHeader from "~/components/PageHeader";
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

type FormValues = {
  title: string;
  type: ChallengeType;
  difficulty: Difficulty;
};

const NewChallengePage: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const {
    acceptedFiles: acceptedImageFiles,
    getRootProps: getImageRootProps,
    getInputProps: getImageInputProps,
  } = useDropzone({
    multiple: true,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
  });
  const {
    acceptedFiles: acceptedVideoFiles,
    getRootProps: getVideoRootProps,
    getInputProps: getVideoInputProps,
  } = useDropzone({
    accept: {
      "video/mp4": [".mp4"],
      "video/mkv": [".mkv"],
    },
    multiple: false,
    maxSize: 10000000, // 10MB
  });
  const [desc, setDesc] = useState<string>(
    startingMarkdownTemplate["Frontend"]
  );
  const [showImageError, setShowImageError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const createChallenge = api.challenge.create.useMutation({
    onSuccess: () => {
      setLoading(false);
      void router.push("/challenges");
    },
    onError: () => {
      setLoading(false);
    },
  });
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!data.title || !data.type || !data.difficulty) {
      return alert("Please fill all the fields");
    }
    if (acceptedImageFiles.length === 0) {
      setShowImageError(true);
      return;
    }
    setLoading(true);
    const urls = (await Promise.all([
      await uploadToCloudinary(acceptedImageFiles),
      await uploadToCloudinary(acceptedVideoFiles, true),
    ])) as [string[], string[]];

    await createChallenge.mutateAsync({
      difficulty: data.difficulty,
      imagesURL: urls[0],
      briefDesc: desc,
      title: data.title,
      type: data.type,
      videoURL: urls[1].length ? urls[1][0] : undefined,
    });
  };

  useEffect(() => {
    if (acceptedImageFiles.length > 0) {
      setShowImageError(false);
    }
  }, [acceptedImageFiles]);

  return (
    <>
      <Head>
        <title>Create a new Challenge</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageHeader pageTitle="New Challenge" />
      <main className="flex min-h-screen flex-col py-12 ">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleSubmit(onSubmit)();
          }}
          className="mx-auto flex w-full max-w-3xl flex-col rounded-lg border bg-white p-6 shadow-sm"
        >
          <div className="flex flex-col space-x-2">
            <label className="label">
              <span className="label-text text-base font-medium">
                Challenge title *
              </span>
            </label>
            <input
              {...register("title", {
                required: "Challenge title is required",
              })}
              placeholder=""
              type="text"
              className={`input-bordered ${
                errors.title ? "input-error" : ""
              } input w-full`}
            />
            {errors.title?.type === "required" && (
              <label className="label">
                <span className="label-text-alt text-red-400">
                  {errors.title?.message}
                </span>
              </label>
            )}
          </div>
          <div className="flex flex-col space-x-2">
            <label className="label">
              <span className="label-text text-base font-medium">
                Challenge Type *
              </span>
            </label>
            <select {...register("type")} className="select-bordered select">
              {Object.values(ChallengeType).map((type, i) => (
                <option key={i} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col space-x-2">
            <label className="label">
              <span className="label-text text-base font-medium">
                Difficulty *
              </span>
            </label>
            <select
              {...register("difficulty")}
              className="select-bordered select"
            >
              {Object.values(Difficulty).map((d, i) => (
                <option key={i} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col space-x-2">
            <label className="label justify-start space-x-2">
              <span className=" label-text text-base font-medium">
                Challenge Images *
              </span>
              {showImageError && (
                <span className="label-text-alt text-red-400">
                  Please upload at least one image
                </span>
              )}
            </label>
            <DropZoneInput
              acceptedFiles={acceptedImageFiles}
              getInputProps={getImageInputProps}
              getRootProps={getImageRootProps}
            />
          </div>
          <div className="flex flex-col space-x-2">
            <label className="label">
              <span className="label-text text-base font-medium">
                Challenge Videos (optional)
              </span>
            </label>
            <DropZoneInput
              acceptedFiles={acceptedVideoFiles}
              getInputProps={getVideoInputProps}
              getRootProps={getVideoRootProps}
            />
          </div>
          <div data-color-mode="light" className="flex flex-col space-x-2  ">
            <label className="label">
              <span className="label-text text-base font-medium">
                Brief Description *
              </span>
            </label>
            <section className="">
              <MDEditor
                value={desc}
                className=""
                onChange={(val) => {
                  setDesc(val || "");
                }}
                preview="edit"
                enableScroll
                previewOptions={{
                  className: "prose",
                }}
                extraCommands={[codeEdit, codePreview, codeLive]}
              />
            </section>
          </div>
          <button
            type="submit"
            className="btn-primary btn mt-5"
            disabled={loading}
          >
            {loading && (
              <span
                className="mr-1 inline-block h-4 w-4 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white "
                role="status"
                aria-label="loading"
              ></span>
            )}
            {loading ? "Loading" : "Submit"}
          </button>
        </form>
      </main>
    </>
  );
};

export default NewChallengePage;




export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerAuthSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

const startingMarkdownTemplate = {
  Frontend: `
  ## Brief
  
  [Provide a brief description of the challenge]
  
  ## Requirements
  
  - [List of requirements]
  
  ## Design
  
  [Include a screenshot or a link to the design file]
  
  ## Data
  
  [If applicable, provide a link to the data source]
  
  ## Instructions
  
  - [Step by step instructions for completing the challenge]
  - [Any additional information that the user may need]
  
  ## Bonus
  
  - [List of bonus tasks that can be completed for extra points]
  - [Include any specific instructions for completing the bonus tasks]
  `,
};
