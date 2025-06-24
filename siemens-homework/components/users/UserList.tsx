"use client";

import { useEffect, useState } from "react";
import { getUsers, User, UserList } from "./users";
import { UserCard } from "./UserCard";

export function UserResults() {
  const [helperUsers, setHelperUsers] = useState<UserList | null>(null);
  const [users, setUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    fetch("https://randomuser.me/api/?results=10", {
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

          data?.results.map((user: User) => {
            if (zipCodeHasPrime(user.location.postcode)) {
              setUsers(users !== null ? [...users, user] : [user]);
            }
          });
          setLoading(false);
        }
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {!loading && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {users &&
              users.length > 0 &&
              users.map((user, index) => (
                <UserCard key={user.id.value || index} user={user} />
              ))}
          </div>
          {users && users.length === 0 && (
            <div className="text-xl font-medium text-center">No results!</div>
          )}
          {error && (
            <div className="text-xl font-medium text-center">{error}</div>
          )}
        </>
      )}
    </div>
  );
}
