import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import "@/styles/cardScrollEffect.css";

export default function Header() {
  return (
    <main className="my-theme">
      <div className="sticker">
        <div className="content1">
          <div className="panel">
            
            {/* Panel Row 1 */}
            <div className="panel__row sensitive-cursor">
              <div className="card card--one">
                <div className="card__column">
                  <div className="image headspace">
                    <svg
                      role="img"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <title>Codeforces</title>
                      <path d="M4.5 7.5C5.328 7.5 6 8.172 6 9v10.5c0 .828-.672 1.5-1.5 1.5h-3C.673 21 0 20.328 0 19.5V9c0-.828.673-1.5 1.5-1.5h3zm9-4.5c.828 0 1.5.672 1.5 1.5v15c0 .828-.672 1.5-1.5 1.5h-3c-.827 0-1.5-.672-1.5-1.5v-15c0-.828.673-1.5 1.5-1.5h3zm9 7.5c.828 0 1.5.672 1.5 1.5v7.5c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5V12c0-.828.672-1.5 1.5-1.5h3z" />
                    </svg>
                  </div>
                </div>
                <div className="card__content">
                  <div className="card__details">
                    <h3>Codeforces</h3>
                  </div>
                  <div className="flex flex-col space-y-4 w-full p-4">
                    <Skeleton className="h-4 w-3/4 bg-gray-300" />
                    <Skeleton className="h-20 w-full rounded-lg bg-gray-300" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-1/2 bg-gray-300" />
                      <Skeleton className="h-4 w-5/6 bg-gray-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="panel__row">
              <div className="card card--two">
                <div className="card__column">
                  <div className="image headspace">
                    <svg
                      role="img"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <title>Codeforces</title>
                      <path d="M4.5 7.5C5.328 7.5 6 8.172 6 9v10.5c0 .828-.672 1.5-1.5 1.5h-3C.673 21 0 20.328 0 19.5V9c0-.828.673-1.5 1.5-1.5h3zm9-4.5c.828 0 1.5.672 1.5 1.5v15c0 .828-.672 1.5-1.5 1.5h-3c-.827 0-1.5-.672-1.5-1.5v-15c0-.828.673-1.5 1.5-1.5h3zm9 7.5c.828 0 1.5.672 1.5 1.5v7.5c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5V12c0-.828.672-1.5 1.5-1.5h3z" />
                    </svg>
                  </div>
                </div>
                <div className="card__content">
                  <div className="card__details"></div>
                  <div className="flex flex-col space-y-4 w-full p-4">
                    <Skeleton className="h-4 w-3/4 bg-gray-300" />
                    <Skeleton className="h-4 w-1/2 bg-gray-300" />
                    <div className="space-y-2">
                      <Skeleton className="h-20 w-full rounded-lg bg-gray-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="panel__row">
              <div className="card card--three">
                <div className="card__column">
                  <div className="image headspace">
                    <svg
                      role="img"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <title>Codeforces</title>
                      <path d="M4.5 7.5C5.328 7.5 6 8.172 6 9v10.5c0 .828-.672 1.5-1.5 1.5h-3C.673 21 0 20.328 0 19.5V9c0-.828.673-1.5 1.5-1.5h3zm9-4.5c.828 0 1.5.672 1.5 1.5v15c0 .828-.672 1.5-1.5 1.5h-3c-.827 0-1.5-.672-1.5-1.5v-15c0-.828.673-1.5 1.5-1.5h3zm9 7.5c.828 0 1.5.672 1.5 1.5v7.5c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5V12c0-.828.672-1.5 1.5-1.5h3z" />
                    </svg>
                  </div>
                </div>
                <div className="card__content">
                  <div className="card__details"></div>
                  <div className="flex flex-col space-y-4 w-full p-4">
                    <Skeleton className="h-4 w-3/4 bg-gray-300" />
                    <Skeleton className="h-20 w-full rounded-lg bg-gray-300" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-1/2 bg-gray-300" />
                      <Skeleton className="h-4 w-5/6 bg-gray-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="panel__row">
              <div className="card card--four">
                <div className="card__column">
                  <div className="image headspace">
                    <svg
                      role="img"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <title>Codeforces</title>
                      <path d="M4.5 7.5C5.328 7.5 6 8.172 6 9v10.5c0 .828-.672 1.5-1.5 1.5h-3C.673 21 0 20.328 0 19.5V9c0-.828.673-1.5 1.5-1.5h3zm9-4.5c.828 0 1.5.672 1.5 1.5v15c0 .828-.672 1.5-1.5 1.5h-3c-.827 0-1.5-.672-1.5-1.5v-15c0-.828.673-1.5 1.5-1.5h3zm9 7.5c.828 0 1.5.672 1.5 1.5v7.5c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5V12c0-.828.672-1.5 1.5-1.5h3z" />
                    </svg>
                  </div>
                </div>
                <div className="card__content">
                  <div className="card__details"></div>
                  <div className="flex flex-col space-y-4 w-full p-4">
                    <Skeleton className="h-8 w-full rounded-lg bg-gray-300" />
                    <Skeleton className="h-4 w-3/4 bg-gray-300" />
                  </div>
                </div>
              </div>
            </div>

            <div className="panel__row">
              <div className="card card--five">
                <div className="card__column">
                  <div className="image headspace">
                    <svg
                      role="img"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <title>Codeforces</title>
                      <path d="M4.5 7.5C5.328 7.5 6 8.172 6 9v10.5c0 .828-.672 1.5-1.5 1.5h-3C.673 21 0 20.328 0 19.5V9c0-.828.673-1.5 1.5-1.5h3zm9-4.5c.828 0 1.5.672 1.5 1.5v15c0 .828-.672 1.5-1.5 1.5h-3c-.827 0-1.5-.672-1.5-1.5v-15c0-.828.673-1.5 1.5-1.5h3zm9 7.5c.828 0 1.5.672 1.5 1.5v7.5c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5V12c0-.828.672-1.5 1.5-1.5h3z" />
                    </svg>
                  </div>
                </div>
                <div className="card__content">
                  <div className="card__details"></div>
                  <div className="flex flex-col space-y-4 w-full p-4">
                    <Skeleton className="h-4 w-3/4 bg-gray-300" />
                    <Skeleton className="h-40 w-full rounded-lg bg-gray-300" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-1/2 bg-gray-300" />
                      <Skeleton className="h-4 w-5/6 bg-gray-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="panel__row">
              <div className="card card--six">
                <div className="card__column">
                  <div className="image headspace">
                    <svg
                      role="img"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <title>Codeforces</title>
                      <path d="M4.5 7.5C5.328 7.5 6 8.172 6 9v10.5c0 .828-.672 1.5-1.5 1.5h-3C.673 21 0 20.328 0 19.5V9c0-.828.673-1.5 1.5-1.5h3zm9-4.5c.828 0 1.5.672 1.5 1.5v15c0 .828-.672 1.5-1.5 1.5h-3c-.827 0-1.5-.672-1.5-1.5v-15c0-.828.673-1.5 1.5-1.5h3zm9 7.5c.828 0 1.5.672 1.5 1.5v7.5c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5V12c0-.828.672-1.5 1.5-1.5h3z" />
                    </svg>
                  </div>
                </div>
                <div className="card__content">
                  <div className="card__details"></div>
                  <div className="flex flex-col space-y-4 w-full p-4">
                    <Skeleton className="h-4 w-3/4 bg-gray-300" />
                    <Skeleton className="h-28 w-full rounded-lg bg-gray-300" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-1/2 bg-gray-300" />
                      <Skeleton className="h-4 w-5/6 bg-gray-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="scroller">
        <div className="content1">
          <div className="panel">
            <div></div>
          </div>
        </div>
      </div>
      <div className="ring1 ring1--under">
        <Image
          src="portal.jpg"
          alt="ring1"
          width={1400}
          height={700}
          priority={true}
          unoptimized={true}
        />
      </div>
      <div className="ring1 ring1--over">
        <Image
          src="portal.jpg"
          alt="ring1"
          width={1400}
          height={700}
          priority={true}
          unoptimized={true}
        />
      </div>
    </main>
  );
}