import React, { useState, useEffect } from "react";
import { Framework } from "@superfluid-finance/sdk-core";
import {
  Button,
  Form,
  FormGroup,
  FormControl,
  Spinner,
  Card
} from "react-bootstrap";
import "./UpdateStream.css";
import { ethers } from "ethers";
import * as PushAPI from "@pushprotocol/restapi";

const sendNotification = async(titlein, bodyin,recipientin) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);

  const signer = provider.getSigner();
    try {
      const recipient = `eip155:5:${recipientin}`
      const apiResponse = await PushAPI.payloads.sendNotification({
        signer,
        type: 3, // target
        identityType: 2, // direct payload
        notification: {
          title: titlein,
          body: bodyin
        },
        payload: {
          title: titlein,
          body: bodyin,
          cta: '',
          img: ''
        },
        recipients: recipient, // recipient address
        channel: 'eip155:5:0x49403ae592C82fc3f861cD0b9738f7524Fb1F38C', // your channel address
        env: 'staging'
      });
      
      // apiResponse?.status === 204, if sent successfully!
      console.log('API repsonse: ', apiResponse);
    } catch (err) {
      console.error('Error: ', err);
    }
  }

//where the Superfluid logic takes place
async function updateExistingFlow(recipient, flowRate,setIsCreated,setFlowRate,setRecipient) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);

  const signer = provider.getSigner();

  const chainId = await window.ethereum.request({ method: "eth_chainId" });
  const sf = await Framework.create({
    chainId: Number(chainId),
    provider: provider
  });

  const superSigner = sf.createSigner({ signer: signer });

  console.log(signer);
  console.log(await superSigner.getAddress());
  const daix = await sf.loadSuperToken("fDAIx");

  console.log(daix);

  try {
    const send=await superSigner.getAddress();
    const updateFlowOperation = daix.updateFlow({
      sender: send,
      receiver: recipient,
      flowRate: flowRate
      // userData?: string
    });

    console.log(updateFlowOperation);
    console.log("Updating your stream...");

    const result = await updateFlowOperation.exec(superSigner);
    console.log(result);

    console.log(
      `Congrats - you've just updated a money stream!
    `
    );
    sendNotification("Stream Updated",`Stream updated to ${flowRate} wei/second by ${send}`,recipient);
    setIsCreated(true);
    setRecipient("");
    setFlowRate("");
  } catch (error) {
    console.log(
      "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
    );
    console.error(error);
  }
}

const UpdateStream = ({checkIfWalletIsConnected,currentAccount}) => {
  const [recipient, setRecipient] = useState("");
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [flowRate, setFlowRate] = useState("");
  const [flowRateDisplay, setFlowRateDisplay] = useState("");
  const [isCreated, setIsCreated] = useState(false);
  

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  function calculateFlowRate(amount) {
    if (typeof Number(amount) !== "number" || isNaN(Number(amount)) === true) {
      alert("You can only calculate a flowRate based on a number");
      return;
    } else if (typeof Number(amount) === "number") {
      if (Number(amount) === 0) {
        return 0;
      }
      const amountInWei = ethers.BigNumber.from(amount);
      const monthlyAmount = ethers.utils.formatEther(amountInWei.toString());
      const calculatedFlowRate = monthlyAmount * 3600 * 24 * 30;
      return calculatedFlowRate;
    }
  }

  function UpdateButton({ isLoading, children, ...props }) {
    return (
      <Button variant="success" className="button" {...props}>
        {isButtonLoading ? "Updating..." : children}
      </Button>
    );
  }

  const handleRecipientChange = (e) => {
    setRecipient(() => ([e.target.name] = e.target.value));
  };

  const handleFlowRateChange = (e) => {
    setFlowRate(() => ([e.target.name] = e.target.value));
    let newFlowRateDisplay = calculateFlowRate(e.target.value);
    setFlowRateDisplay(newFlowRateDisplay.toString());
  };

  return (
    <div className="US" id="update">
      <h2 className="title">Update a Flow</h2>
      
      <Form className="Form">
        <FormGroup className="mb-3">
          <FormControl className="textbox"
            name="recipient"
            value={recipient}
            onChange={handleRecipientChange}
            placeholder="Enter recipient address"
          ></FormControl>
        </FormGroup>
        <FormGroup className="mb-3">
          <FormControl className="textbox"
            name="flowRate"
            value={flowRate}
            onChange={handleFlowRateChange}
            placeholder="Enter a flowRate in wei/second"
          ></FormControl>
        </FormGroup>
        <UpdateButton
          onClick={() => {
            setIsButtonLoading(true);
            updateExistingFlow(recipient, flowRate,setIsCreated,setFlowRate,setRecipient);
            setTimeout(() => {
              setIsButtonLoading(false);
            }, 10000);
            setTimeout(() => {
              setIsCreated(false);
            }, 20000);
          }}
        >
          Click to Update Your Stream
        </UpdateButton>
        <h1 className="updated">{isCreated ? "Stream Updated" : ""}</h1>
      </Form>

      <div className="description">
        <div className="calculation">
          <p>Updated Flow</p>
          <p>
            <b>${flowRateDisplay !== " " ? flowRateDisplay : 0}</b> DAIx/month
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpdateStream;
