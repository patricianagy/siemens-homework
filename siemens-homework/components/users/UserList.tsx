"use client";

import { useEffect, useState } from "react";
import { User } from "./users";
import { UserCard } from "./UserCard";
import { Pagination } from "../pagination/Pagination";
import Select from "react-select";

export function UserResults() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gender, setGender] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [endOfList, setEndOfList] = useState<boolean>(false);

  const options = [
    { value: "female", label: "Female" },
    { value: "male", label: "Male" },
    { value: "", label: "Does not matter" },
  ];

  function isNumber(char: string): boolean {
    return !isNaN(Number(char));
  }

  function isPrime(digit: number): boolean {
    if (digit <= 1) {
      return false;
    }
    if (digit === 2) {
      return false;
    }

    for (let i = 2; i <= 3; i += 1) {
      if (digit % i === 0) {
        return false;
      }
    }

    return true;
  }

  function zipCodeHasPrime(zipCode: string) {
    if (zipCode != null) {
      let primeCount = 0;

      zipCode
        .toString()
        .split("")
        .forEach((digit) => {
          if (isNumber(digit)) {
            if (isPrime(+digit)) {
              primeCount++;
            }
          }
        });

      return primeCount > 1;
    } else {
      return false;
    }
  }

  useEffect(() => {
    fetch("https://randomuser.me/api/?seed=abcd&results=10&page=1", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          setError("Sorry something went wrong, please try later!");
        } else {
          const data = await res.json();

          const helperArray: User[] = [];
          data?.results.map((user: User) => {
            if (zipCodeHasPrime(user.location.postcode)) {
              helperArray.push(user);
            }
          });
          setUsers(helperArray);
          setError(null);
        }
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  function getUsers(genderValue: string, pageNumber: number) {
    setUsers([]);
    fetch(
      `https://randomuser.me/api/?seed=abcd&results=10&page=${pageNumber}&gender=${genderValue}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then(async (res) => {
        if (!res.ok) {
          setError("Sorry something went wrong, please try later!");
        } else {
          const data = await res.json();
          if (data.results.length < 10) {
            setEndOfList(true);
          }

          const helperArray: User[] = [];
          data?.results.map((user: User) => {
            if (zipCodeHasPrime(user.location.postcode)) {
              helperArray.push(user);
            }
          });
          setUsers(helperArray);
          setError(null);
        }
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div>
      {!loading && (
        <>
          <Select
            options={options}
            className="w-full sm:w-[30%] mb-2"
            placeholder="Select gender!"
            onChange={(value) => {
              if (value) {
                setGender(value?.value);
                setPage(1);
                if (endOfList) {
                  setEndOfList(false);
                }
                getUsers(value?.value, 1);
              }
            }}
          />
          <div className="mb-8">
            A seedeléssel együtt nem műkődik a gender szűrő a lekérésben és nem
            került bele a v1.4-be:{" "}
            <a
              href="https://github.com/RandomAPI/Randomuser.me-Node/issues/188"
              target="_blank"
            >
              Github issue
            </a>{" "}
            <a href="https://randomuser.me/changelog" target="_blank">
              Change log
            </a>
          </div>
          {users.length > 0 && (
            <div className="w-full flex flex-col items-center justify-center gap-7">
              <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-6">
                {users.map((user) => (
                  <UserCard key={user.login.uuid} user={user} />
                ))}
              </div>
              <Pagination
                pageNumber={page}
                endOfList={endOfList}
                prevClickAction={() => {
                  setPage(page - 1);
                  if (endOfList) {
                    setEndOfList(false);
                  }
                  getUsers(gender, page - 1);
                }}
                nextClickAction={() => {
                  setPage(page + 1);
                  getUsers(gender, page + 1);
                }}
              />
            </div>
          )}
          {users.length === 0 && (
            <div className="text-xl font-medium text-center">No results!</div>
          )}

          {error && (
            <div className="text-xl font-medium text-center">{error}</div>
          )}
        </>
      )}
      {loading && (
        <div className="text-xl font-medium text-center">Loading</div>
      )}
    </div>
  );
}
