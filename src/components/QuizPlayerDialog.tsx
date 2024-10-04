import { shuffle } from "@/helpers/generalUtils";
import { CheckIcon, CloseIcon } from "@/helpers/icons";
import { generateQuizCardContent } from "@/helpers/quizUtils";
import {
  CardSide,
  CommonDialogProps,
  Quiz,
  QuizCard,
  QuizCardContent,
} from "@/helpers/types";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Slide,
  Toolbar,
  Typography,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { UUID } from "crypto";
import React, { useEffect, useState } from "react";

import utilClassInstances from "../helpers/utilClassInstances";
import ReactCardFlip from "react-card-flip";
const { localStorageHelperInstance } = utilClassInstances;

interface Props extends CommonDialogProps {
  quizId?: UUID | null;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const QuizPlayerDialog: React.FC<Props> = ({ open, onClose, quizId }) => {
  const [cardsRemaining, setCardsRemaining] = useState<QuizCard[]>([]);
  const [viewingCardSide, setViewingCardSide] = useState<CardSide>("front");
  const currentCard = cardsRemaining[0];

  useEffect(() => {
    if (open && quizId) {
      const quiz = localStorageHelperInstance.getQuizById(quizId);
      if (!quiz) {
        return;
      }

      const newCardsRemaining = [...quiz.cards];
      if (quiz.order === "in_order") {
        setCardsRemaining(newCardsRemaining);
      } else if (quiz.order === "random") {
        shuffle(newCardsRemaining);
        setCardsRemaining(newCardsRemaining);
      }
    } else {
      setCardsRemaining([]);
    }
    setViewingCardSide("front");
  }, [open, quizId]);

  const onFlipToBack = () => setViewingCardSide("back");
  const removeCard = () => {
    const newCardsRemaining = [...cardsRemaining];
    newCardsRemaining.shift();
    setCardsRemaining(newCardsRemaining);
    setViewingCardSide("front");
  };

  const shuffleCard = () => {
    const newCardsRemaining = [...cardsRemaining];
    shuffle(newCardsRemaining);
    setCardsRemaining(newCardsRemaining);
    setViewingCardSide("front");
  };

  const content = currentCard ? (
    generateQuizCardContent(currentCard)
  ) : (
    <Box display={"flex"} alignItems={"center"}>
      <CheckIcon sx={{ fontSize: 48, mr: 2 }} color="success" />
      All done!
    </Box>
  );
  return (
    <Dialog open={open} TransitionComponent={Transition}>
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Quiz ({cardsRemaining.length} cards remaining)
          </Typography>
        </Toolbar>
      </AppBar>

      <DialogContent sx={{ width: ["100%", 350], minHeight: 100 }}>
        {currentCard && content && (
          <ReactCardFlip isFlipped={viewingCardSide === "back"}>
            <Card key="front">
              <CardContent>{(content as QuizCardContent).front}</CardContent>
            </Card>
            <Card key="back">
              <CardContent>{(content as QuizCardContent).back}</CardContent>
            </Card>
          </ReactCardFlip>
        )}
        {!currentCard && content}
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-evenly" }}>
        {currentCard && (
          <>
            {viewingCardSide === "front" && (
              <Button onClick={onFlipToBack}>Show answer</Button>
            )}
            {viewingCardSide === "back" && (
              <>
                <Button onClick={removeCard} color="success">
                  Got it
                  <br />
                </Button>
                <Button onClick={shuffleCard} color="warning">
                  I need more practice
                </Button>
              </>
            )}
          </>
        )}
        {!currentCard && <Button onClick={onClose}>Close</Button>}
      </DialogActions>
    </Dialog>
  );
};

export default QuizPlayerDialog;
