import React, { useRef } from "react";
import { Button, Overlay, Tooltip } from "react-bootstrap";
import QRCode from "react-qr-code";
import { useClipboard } from "use-clipboard-copy";
import useMessageModal from "../../hooks/useMessageModal";
import { getShareGameLink, trackGameCodeClick } from "../../utils";

interface IGameCodeProps {
  gameId: string;
  isBanker: boolean;
}

const GameCode: React.FC<IGameCodeProps> = ({ gameId, isBanker }) => {
  const showMessage = useMessageModal();

  const gameIdClicked = () => {
    showMessage({
      title: "Share game",
      body: <ShareGameModalContent gameId={gameId} />,
      closeButtonText: null
    });
    trackGameCodeClick();
  };

  return (
    <div className="text-center">
      <h1 onClick={gameIdClicked}>{gameId}</h1>
      <div>
        <small className="text-muted">
          Tap the code above to get a QR code or copy a link to help other players join
        </small>
      </div>
      {isBanker && (
        <small className="text-muted">You can hide this by closing the game in the settings</small>
      )}
      <hr />
    </div>
  );
};

interface ShareGameModalContentProps {
  gameId: string;
}

const ShareGameModalContent = ({ gameId }: ShareGameModalContentProps) => {
  const shareLink = getShareGameLink(gameId);

  const clipboard = useClipboard({
    copiedTimeout: 1000
  });
  const copyTooltipTarget = useRef<HTMLButtonElement>(null);

  const copyLink = () => {
    clipboard.copy(shareLink);
  };

  return (
    <>
      <p className="text-center">Get others to scan the code below to join your game</p>
      <div className="mt-4 text-center">
        <QRCode value={shareLink} />
      </div>

      <div className="mt-4">
        <Button block onClick={copyLink} ref={copyTooltipTarget}>
          Copy link to send to others
        </Button>
      </div>

      <Overlay target={copyTooltipTarget.current} show={clipboard.copied} placement="bottom">
        {(props) => (
          <Tooltip id="overlay-example" {...props}>
            Copied to clipboard
          </Tooltip>
        )}
      </Overlay>
    </>
  );
};

export default GameCode;
