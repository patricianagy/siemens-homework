"use client";

import { useEffect, useState } from "react";
import { User } from "./users";
import { UserCard } from "./UserCard";
import Select from "react-select";
import { Pagination } from "../pagination/Pagination";

export function UserResults() {
  const [users, setUsers] = useState<User[] | null>(null);
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
    if (digit <= 1) return false;
    if (digit === 2) return true;

    for (let i = 2; i <= 4; i += 1) {
      if (digit % i === 0) return false;
    }

    return true;
  }

  function zipCodeHasPrime(zipCode: string) {
    if (zipCode != null) {
      let primeCount = 0;

      zipCode
        .toString()
        .split("")
        .map((digit) => {
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
    fetch("https://randomuser.me/api/?results=10&page=1", {
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
      `https://randomuser.me/api/?results=10&page=${pageNumber}&gender=${genderValue}`,
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
      <Select
        options={options}
        className="w-full sm:w-[30%] mb-8"
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
      {!loading && (
        <>
          {users && (
            <>
              {users.length > 0 && (
                <div className="w-full flex flex-col items-center justify-center gap-7">
                  <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-6">
                    {users.map((user, index) => (
                      <UserCard key={user.id.value || index} user={user} />
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
                <div className="text-xl font-medium text-center">
                  No results!
                </div>
              )}
            </>
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
