import React, { useEffect, useCallback, useState } from "react";
import { Container, Nav } from "react-bootstrap";
import { login, logout as destroy, accountBalance } from "./utils/near";
import Wallet from "./components/Wallet";
import { Notification } from "./components/utils/Notifications";
import Stores from "./components/expressstores";
import Cover from "./components/utils/Cover";
import coverImg from "./assets/img/storefour.jpg";
import "./App.css";


const App = function AppWrapper() {

  const account = window.walletConnection.account();
  const [balance, setBalance] = useState("0");

  const getBalance = useCallback(async () => {
    if (account.accountId) {
      setBalance(await accountBalance());
    }
  }, [account]);

  useEffect(() => {
    getBalance();
  }, [getBalance]);
  return (
    <>
      <Notification />
      {account.accountId ? (
      // {true ? (
        <Container fluid className="px-3 py-2">
          <Nav className="justify-content-end pt-3 pb-5">
            <Nav.Item>
              <Wallet
                address={account.accountId}
                amount={balance}
                symbol="NEAR"
                destroy={destroy}
              />
            </Nav.Item>
          </Nav>
          <main><Stores /></main>
        </Container>
      ) : (
        <Cover name="Near Express Stores" login={login} coverImg={coverImg} />
      )}
    </>
  );
};

export default App;