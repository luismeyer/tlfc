"use client";

export function Facts() {
  return (
    <div className="w-10/12 m-auto grid grid-cols-2 lg:grid-cols-4 gap-20 my-20">
      <div className="flex flex-col gap-2">
        <img
          src="/locker-dynamic-color.png"
          alt="Image of Locker"
          className="w-20"
        />

        <div className="flex flex-col gap-1">
          <h3 className="text-xl">Typesafe</h3>
          <p className="text-sm">
            TLFC is typesafe out of the box. It ensures a strict interface
            between the client and the lambda. By relying on zod's schema
            validation TLFC ensures typesafe network calls without any extra
            development work.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <img
          src="/computer-dynamic-color.png"
          alt="Image of Computer"
          className="w-20"
        />

        <div className="flex flex-col gap-1">
          <h3 className="text-xl">Development experience</h3>
          <p className="text-sm">
            TLFC provides a great development experience. It has nearly no
            configuration and provides an easy to use API. By creating an
            abstraction over the network layer implementing a lambda fetch feels
            like calling a function.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <img
          src="/zoom-dynamic-color.png"
          alt="Image of Zoom"
          className="w-20"
        />

        <div className="flex flex-col gap-1">
          <h3 className="text-xl">Payload validation</h3>
          <p className="text-sm">
            To ensure absolute safety TLFC not only performs checks on
            compile-time. It also validates the request payloads in the lambda
            and response payloads in the clients at run-time.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <img
          src="/rocket-dynamic-color.png"
          alt="Image of Zoom"
          className="w-20"
        />

        <div className="flex flex-col gap-1">
          <h3 className="text-xl">Batteries included</h3>
          <p className="text-sm">
            TLFC brings all utilities to run a local dev environment, bundle the
            lambdas and even deploy to AWS. It provides a CLI, a programmatic
            interface and plugins to integrate into you frontend toolkit.
          </p>
        </div>
      </div>
    </div>
  );
}
